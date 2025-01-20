package com.wgtpivotlo.wgtpivotlo.utils.converter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Slf4j
public class MultiPartFileConverter {
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
}
