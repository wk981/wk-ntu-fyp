package com.wgtpivotlo.wgtpivotlo.errors;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@Component
public class CustomErrorAttributes extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
        // Retrieve the default error attributes from Spring Boot
        Map<String, Object> defaultAttributes = super.getErrorAttributes(webRequest, options);

        // Build your custom error response
        Map<String, Object> customAttributes = new HashMap<>();
        customAttributes.put("code", defaultAttributes.get("status"));
        customAttributes.put("message", defaultAttributes.get("detail") != null
                ? defaultAttributes.get("detail")
                : defaultAttributes.get("error"));
        customAttributes.put("path", defaultAttributes.get("path"));
        customAttributes.put("timestamp", defaultAttributes.get("timestamp"));

        // Add any additional properties if needed
        // customAttributes.put("myCustomField", "customValue");

        return customAttributes;
    }
}