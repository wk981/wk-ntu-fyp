package com.wgtpivotlo.wgtpivotlo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
public class Ping {
    @Value("${spring.cors.url}")
    private String corsURLList;

    @GetMapping("/ping")
    public ResponseEntity<String> pong(){
        return ResponseEntity.ok("pong@");
    }

    @GetMapping("/cors-url")
    public ResponseEntity<?> corsURLPrint(){
        String[] parts = corsURLList.split(",");
        List<String> corsURL = new ArrayList<>();
        Collections.addAll(corsURL, parts);
        return ResponseEntity.ok(corsURL);
    }
}
