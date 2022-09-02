package ru.kata.spring.boot_security.demo.ExceptionHandler;

import org.springframework.dao.DataIntegrityViolationException;

public class UserWithSuchLoginExist extends DataIntegrityViolationException {
    public UserWithSuchLoginExist(String msg) {
        super(msg);
    }
}