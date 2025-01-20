package com.wgtpivotlo.wgtpivotlo.service;

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

    public void processFile(MultipartFile multiPartFile) throws IOException, InvalidFormatException {
        String contentType = multiPartFile.getContentType();
        if(!allowedFileSet.contains(contentType)){
            throw new BadRequestException("Wrong file type. Please upload file ends with PDF, DOC or DOCX");
        }
        File file = MultiPartFileConverter.converMultiPartFileToFile(multiPartFile);

        if(Objects.equals(contentType, "application/pdf")){
            PDDocument document = Loader.loadPDF((File) file);
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            String[] paragraphs = text.split("\n\\s*\n");

            // Print each paragraph
            for (String paragraph : paragraphs) {
                System.out.println("Paragraph:");
                System.out.println(paragraph.trim());
                System.out.println("-----------------------------------");
            }
        }
        else{
            XWPFDocument document = new XWPFDocument(OPCPackage.open(file));
            List<XWPFParagraph> paragraphs = document.getParagraphs();
            for(XWPFParagraph xwpfParagraph: paragraphs){
                System.out.println("Paragraph:");
                System.out.println(xwpfParagraph.getText().trim());
                System.out.println("-----------------------------------");
            }
        }
        MultiPartFileConverter.handleDeleteFile(file);
    }

}
