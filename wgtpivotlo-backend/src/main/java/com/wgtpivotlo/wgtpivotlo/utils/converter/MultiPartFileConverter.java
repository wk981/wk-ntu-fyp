package com.wgtpivotlo.wgtpivotlo.utils.converter;

import com.wgtpivotlo.wgtpivotlo.enums.FileFormat;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Slf4j
public class MultiPartFileConverter {
    private static Map<String, FileFormat> fileFormatMap;
    static {
        fileFormatMap = Map.of("application/msword", FileFormat.DOC, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", FileFormat.DOC, "application/vnd.openxmlformats-officedocument.wordprocessingml.template", FileFormat.DOC, "application/vnd.ms-word.document.macroEnabled.12", FileFormat.DOC, "application/vnd.ms-word.template.macroEnabled.12", FileFormat.DOC, "application/pdf", FileFormat.PDF);
    }
    public static File converMultiPartFileToFile(MultipartFile multiPartFile) throws IOException {
        String originalFilename = multiPartFile.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "tempFile";
        }
        File file = File.createTempFile("multipart-", "-" + originalFilename);
        multiPartFile.transferTo(file);

        return file;
    }

    public static void handleDeleteFile(File file){
        boolean status = file.delete();
        if(status){
            log.info("File deleted");
        }
        else{
            log.info("File not deleted");
        }
    }

    public static FileFormat getFileFormat(String contentType){
        return fileFormatMap.get(contentType);
    }
}
