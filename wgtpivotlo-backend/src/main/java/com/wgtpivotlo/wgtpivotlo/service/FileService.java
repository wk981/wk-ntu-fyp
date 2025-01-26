package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.dto.SkillDTO;
import com.wgtpivotlo.wgtpivotlo.enums.FileFormat;
import com.wgtpivotlo.wgtpivotlo.errors.exceptions.ResourceNotFoundException;
import com.wgtpivotlo.wgtpivotlo.model.Skill;
import com.wgtpivotlo.wgtpivotlo.model.UserSkills;
import com.wgtpivotlo.wgtpivotlo.repository.SkillRepository;
import com.wgtpivotlo.wgtpivotlo.repository.UserSkillsRepository;
import com.wgtpivotlo.wgtpivotlo.security.UserDetailsImpl;
import com.wgtpivotlo.wgtpivotlo.utils.converter.MultiPartFileConverter;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.usermodel.*;
import org.apache.xmlbeans.XmlException;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.AccessDeniedException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FileService {
    private final SkillRepository skillRepository;
    private final UserSkillsRepository userSkillsRepository;
    private final Map<String, Pattern> skillCategoryPatternMap;

    public static String output = "resume.docx";
    public static String fontFamily = "Open Sans";

    @Autowired
    public FileService(SkillRepository skillRepository, UserSkillsRepository userSkillsRepository) {
        this.skillRepository = skillRepository;
        this.userSkillsRepository = userSkillsRepository;
        skillCategoryPatternMap = new HashMap<>();
        skillCategoryPatternMap.put("Frontend Framework", Pattern.compile("React|Angular", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("Backend Framework", Pattern.compile("NodeJS|ExpressJS|FastAPI|Springboot", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("Programming Language", Pattern.compile("Python|C\\+\\+|C#|JavaScript|Java|HTML|CSS|TypeScript|HTML and CSS|.*programming$", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("DevOps", Pattern.compile("Docker|Kubernetes|Cloud API", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("Databases", Pattern.compile(".*\\bsql\\b.*", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("Version Control", Pattern.compile("Git|Github", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("Communication", Pattern.compile("Leadership|Public Speaking|Communication", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("Financial", Pattern.compile("Financial Analysis|Accounting|Budgeting", Pattern.CASE_INSENSITIVE));
        skillCategoryPatternMap.put("Data", Pattern.compile(".*\\bdata\\b.*", Pattern.CASE_INSENSITIVE));
    }

    public String getOutput() {
        return output;
    }

    private static Set<String> allowedFileSet = new HashSet<>() {{
        add("application/msword");
        add("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        add("application/vnd.openxmlformats-officedocument.wordprocessingml.template");
        add("application/vnd.ms-word.document.macroEnabled.12");
        add("application/vnd.ms-word.template.macroEnabled.12");
        add("application/pdf");
    }};

    // TODO: Need to improve the search
    public Set<SkillDTO> processFile(MultipartFile multiPartFile) throws IOException, InvalidFormatException {
        String contentType = multiPartFile.getContentType();
        if(!allowedFileSet.contains(contentType)){
            throw new BadRequestException("Wrong file type. Please upload file ends with PDF, DOC or DOCX");
        }
        List<String> resumeLines = convertFileIntoStringList(multiPartFile);

        // Define keywords to identify skill categories
        List<String> keywords = List.of("Languages", "Programming", "Framework", "Databases", "DevOps", "Version Control", "Operating System");

        // Regex to extract text after the colon
        String regex = "(?<=:).*";
        Pattern pattern = Pattern.compile(regex);

        List<String> skills = resumeLines.stream()
                .filter(line -> keywords.stream().anyMatch(line::contains)) // Keep only lines with specific keywords
                .map(pattern::matcher) // Apply regex
                .filter(Matcher::find) // Check if the line contains skills
                .map(matcher -> matcher.group().trim()) // Extract text after colon
                .flatMap(line -> Arrays.stream(line.split(",\\s*|/\\s*|\\s+"))) // Split skills by commas, slashes, or spaces
                .map(String::trim) // Trim whitespace
                .filter(skill -> !skill.isEmpty()) // Remove empty entries
                .toList();

        // Note: For debugging
//        HashMap<String, Skill> res = new HashMap<>();
//
//        for(String skill: skills){
//            Skill query = skillRepository.findNameUsingTriageAndIgnoreCase(skill.toLowerCase().replace(" ", ""));
//            res.put(skill, query);
//        }
        Set<Skill> skillSet = skills.stream()
                .map(s ->
                    skillRepository.findNameUsingTriageAndIgnoreCase(s.toLowerCase().replace(" ", ""))
                )
                .filter(Objects::nonNull) .collect(Collectors.toSet());// Remove null results

        Set<SkillDTO> res = skillSet.stream()
                .map(result -> SkillDTO.builder()
                        .skillId(result.getSkillId())
                        .name(result.getName())
                        .pic(result.getPic_url())
                        .description(result.getDescription())
                        .build())
                .collect(Collectors.toSet()); // Collect the results into a Set

        return res;
    }

    private List<String> convertFileIntoStringList(MultipartFile multiPartFile) throws IOException, InvalidFormatException {
        FileFormat fileFormat = MultiPartFileConverter.getFileFormat(multiPartFile.getContentType());
        File file = MultiPartFileConverter.converMultiPartFileToFile(multiPartFile);
        List<String> res = List.of();
        switch(fileFormat){
            case FileFormat.PDF:
                PDDocument pdfDocument = Loader.loadPDF((File) file);
                PDFTextStripper stripper = new PDFTextStripper();
                String text = stripper.getText(pdfDocument);
                String[] pdfParagraphs = text.split("\n\\s*\n");
                res = Arrays.stream(pdfParagraphs)
                        .filter(Objects::nonNull)     // Exclude null values
                        .map(String::trim)
                        .filter(Objects::nonNull)
                        .filter(s -> !s.isEmpty())    // Exclude empty strings
                        .filter(s -> !s.isBlank())
                        .filter(s -> !s.contains(" "))
                        .toList();
            case FileFormat.DOC:
                XWPFDocument msDocument = new XWPFDocument(OPCPackage.open(file));
                List<XWPFParagraph> msParagraphs = msDocument.getParagraphs();
                res = msParagraphs.stream()
                        .map(XWPFParagraph::getText) // Extract text
                        .filter(Objects::nonNull)    // Exclude null text
                        .map(String::trim)           // Trim whitespace
                        .filter(s -> !s.isEmpty())   // Exclude empty strings
                        .filter(s -> !s.isBlank())
                        .filter(s -> !s.contains(" "))
                        .toList();
        }
        MultiPartFileConverter.handleDeleteFile(file);
        return res;
    }

    public byte[] generateUserResume(Authentication authentication) throws Exception {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new AccessDeniedException("Access Denied");
        }
        log.info("Step 1: Get user's Id");
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();

        log.info("Step 2: Get user's current SkillSet");
        Optional<List<UserSkills>> exitingUserSkillsList = userSkillsRepository.findByUserId(userId);
        exitingUserSkillsList.orElseThrow(() -> new ResourceNotFoundException("User does not have skills"));

        return generateFile(exitingUserSkillsList.get());

    }

    private byte[] generateFile(List<UserSkills> userSkillsList) throws IOException, XmlException {
        XWPFDocument document = new XWPFDocument();
        CTSectPr sectPr = document.getDocument().getBody().isSetSectPr()
                ? document.getDocument().getBody().getSectPr()
                : document.getDocument().getBody().addNewSectPr();

        // Create or get page margin settings
        CTPageMar pageMar = sectPr.isSetPgMar() ? sectPr.getPgMar() : sectPr.addNewPgMar();

        // Set margins (values are in TWIPs: 1 inch = 1440 TWIPs, 0.5 inch = 720 TWIPs)
        pageMar.setTop(720);    // Top margin: 0.5 inch
        pageMar.setBottom(720); // Bottom margin: 0.5 inch
        pageMar.setLeft(720);   // Left margin: 0.5 inch
        pageMar.setRight(720);  // Right margin: 0.5 inch
        pageMar.setGutter(0);   // Gutter: 0 inch

        // Add a title
        XWPFParagraph title = document.createParagraph();
        title.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = title.createRun();
        titleRun.setText("[name]");
        titleRun.setFontSize(10);
        titleRun.setFontFamily(fontFamily);
        titleRun.setBold(true);
        title.setSpacingAfter(0); // No space after the title

        // Add contact information
        XWPFParagraph contactInfo = document.createParagraph();
        contactInfo.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun contactRun = contactInfo.createRun();
        contactRun.setText("Mobile Phone: / Email: / GitHub: /");
        contactRun.setFontFamily(fontFamily);
        contactRun.setFontSize(10);
        contactInfo.setSpacingAfter(0);

        // Add a section header
        addSectionHeader(document, "EDUCATION");
        document.createParagraph();

        // Add technical skills with tight spacing
        addSectionHeader(document, "TECHNICAL SKILLS");
        Map<String, List<Skill>> res = new HashMap<>();
        userSkillsList.stream().map(UserSkills::getSkill).forEach(skill -> processCategoryMap(res, skill)); // Categorize each skill));

        addSkillsBullet(document,res);

        // Add work experience with tight spacing
        addSectionHeader(document, "WORK EXPERIENCE");

        try (FileOutputStream out = new FileOutputStream(output)) {
            document.write(out);
            System.out.println("Document written to file: " + output);
        }

        byte[] byteArrayRes;
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            document.write(baos); // Write document content to memory
            byteArrayRes = baos.toByteArray();
            cleanup(document);
        }

        return byteArrayRes;

    }

    private static void addSectionHeader(XWPFDocument document, String text) {
        XWPFParagraph header = document.createParagraph();
        header.setBorderBottom(Borders.BASIC_THIN_LINES);
        header.setSpacingAfter(0); // Tight spacing after section header
        XWPFRun run = header.createRun();
        run.setText(text);
        run.setFontFamily(fontFamily);
        run.setFontSize(9);
        run.setBold(true);
    }

    private static void addBullet(XWPFDocument document, String text) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setIndentationLeft(360); // Indentation for bullet points
        paragraph.setSpacingAfter(0); // Tight spacing after each bullet
        paragraph.setSpacingBefore(0); // Tight spacing before each bullet
        XWPFRun run = paragraph.createRun();
        run.setFontFamily(fontFamily);
        run.setText("• " + text);
        run.setFontSize(9);
    }

    private static void addWorkExperience(XWPFDocument document, String title, String date, String[] points) {
        XWPFParagraph experienceTitle = document.createParagraph();
        XWPFRun titleRun = experienceTitle.createRun();
        titleRun.setText(title);
        titleRun.setBold(true);
        experienceTitle.setSpacingAfter(0);

        XWPFRun dateRun = experienceTitle.createRun();
        dateRun.setFontFamily(fontFamily);
        dateRun.setText(" " + date);
        dateRun.setFontSize(9);
        dateRun.setItalic(true);

        for (String point : points) {
            addBullet(document, point);
        }
    }

    private void processCategoryMap(Map<String, List<Skill>> res, Skill skill){
        int count = 0;
        for (Map.Entry<String, Pattern> entry : skillCategoryPatternMap.entrySet()) {
            String category = entry.getKey(); // Key: Category name
            Pattern pattern = entry.getValue(); // Value: Pattern

            if (pattern.matcher(skill.getName()).matches()) {
                List<Skill> temp;
                if(res.containsKey(category)){
                    temp = res.get(category);
                }
                else{
                    temp = new ArrayList<>();
                }
                temp.add(skill);
                res.put(category, temp);
                break;
            }
            count += 1;
        }
        if(count == skillCategoryPatternMap.size()){
            List<Skill> temp;
            if(res.containsKey("Others")){
                temp = res.get("Others");
            }
            else{
                temp = new ArrayList<>();
            }
            temp.add(skill);
            res.put("Others", temp);
        }
        return;
    }

    private void addSkillsBullet(XWPFDocument document, Map<String, List<Skill>> res){
        for (Map.Entry<String, List<Skill>> entry : res.entrySet()){
            String category = entry.getKey();
            List<Skill> skillList = entry.getValue();
            String temp = category + ": " + skillList.stream()
                    .map((skill) -> {
                        return capitalizeFirstLetter(skill.getName());
                    }) // Extract skill names
                    .collect(Collectors.joining(", ")); // Join names with commas
            addBullet(document, temp);
        }
    }

    private static String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) {
            return input; // Return input if null or empty
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
    }

    private void cleanup(XWPFDocument document) throws IOException {
        // Delete the file
        File file = new File(output);
        if (file.delete()) {
            log.info("File deleted successfully.");
        } else {
            log.info("File does not exist or file is deleted");
        }

        // Close the document
        document.close();
    }
}
