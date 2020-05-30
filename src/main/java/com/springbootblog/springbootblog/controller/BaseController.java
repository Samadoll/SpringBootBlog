package com.springbootblog.springbootblog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class BaseController {

    @GetMapping("/")
    public String test() {
        return "index";
    }
}
