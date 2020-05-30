package com.springbootblog.springbootblog.controller;

import com.springbootblog.springbootblog.entity.ResponseEntity;
import com.springbootblog.springbootblog.entity.ContentEntity;
import com.springbootblog.springbootblog.service.ContentService;
import com.springbootblog.springbootblog.service.UserService;
import io.swagger.annotations.ApiOperation;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Validated
public class IndexController {

    private final String PAGE_SIZE = "10";

    @Autowired
    private UserService userService;

    @Autowired
    private ContentService contentService;

    @ApiOperation(value = "User Registration", notes = "Send token after successful login, require token one every request")
    @PostMapping("/register")
    public ResponseEntity register(@RequestParam @Length(min = 1, max = 100) String username,
                                   @RequestParam @Length(min = 1, max = 100) String password) {
        userService.register(username, password);
        return new ResponseEntity(HttpStatus.OK.value(), "Successfully Registered", null);
    }

    @ApiOperation(value = "Get contents in the first page")
    @GetMapping("/contents")
    public ResponseEntity index(@RequestParam(required = false, defaultValue = "1", value = "page") int page,
                                @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize) {
        // Pagination
        PageHelper.startPage(page, pageSize);
        Page<List<ContentEntity>> contents = (Page) contentService.getContents();
        Map<String, Object> data = new HashMap<>(2);
        data.put("articles", contents);
        data.put("count", contents.getPages());
        return new ResponseEntity(HttpStatus.OK.value(), "Successfully Get Contents", data);
    }

    @ApiOperation("Get contents by tag")
    @GetMapping("/tag/{tag}")
    public ResponseEntity tags(@PathVariable @Length(min = 1) String tag,
                               @RequestParam(required = false, defaultValue = "1", value = "page") int page,
                               @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize) {
        PageHelper.startPage(page, pageSize);
        Page<List<Map<String, Object>>> contents = (Page) contentService.getContentByTag(tag);
        Map<String, Object> data = new HashMap<>(2);
        data.put("articles", contents);
        data.put("count", contents.getPages());
        return new ResponseEntity(HttpStatus.OK.value(), "Successfully Get Contents", data);
    }
}
