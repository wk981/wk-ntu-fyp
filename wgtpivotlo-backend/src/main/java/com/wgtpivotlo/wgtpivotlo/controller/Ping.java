package com.wgtpivotlo.wgtpivotlo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Ping {
    @Value("${spring.cors.url}")
    private String corsURL;

    @GetMapping("/ping")
    public ResponseEntity<String> pong(){
        return ResponseEntity.ok("pong@");
    }

    @GetMapping("/cors-url")
    public ResponseEntity<String> corsURLPrint(){
        return ResponseEntity.ok(corsURL);
    }
}
