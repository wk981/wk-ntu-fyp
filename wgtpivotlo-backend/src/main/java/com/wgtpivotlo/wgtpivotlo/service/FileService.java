package com.wgtpivotlo.wgtpivotlo.service;

import com.wgtpivotlo.wgtpivotlo.enums.FileFormat;
import com.wgtpivotlo.wgtpivotlo.utils.converter.MultiPartFileConverter;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FileService {
    private static Set<String> allowedFileSet = new HashSet<>() {{
        add("application/msword");
        add("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        add("application/vnd.openxmlformats-officedocument.wordprocessingml.template");
        add("application/vnd.ms-word.document.macroEnabled.12");
        add("application/vnd.ms-word.template.macroEnabled.12");
        add("application/pdf");
    }};

    public List<String> processFile(MultipartFile multiPartFile) throws IOException, InvalidFormatException {
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
                .collect(Collectors.toList());

        return skills;

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

}
