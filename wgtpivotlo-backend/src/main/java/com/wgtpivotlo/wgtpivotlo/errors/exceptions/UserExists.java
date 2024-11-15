package com.wgtpivotlo.wgtpivotlo.errors.exceptions;

public class UserExists extends RuntimeException {
    public UserExists(String message) {
        super(message);
    }
}
