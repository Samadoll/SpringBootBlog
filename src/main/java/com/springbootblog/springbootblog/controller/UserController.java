package com.springbootblog.springbootblog.controller;

import com.springbootblog.springbootblog.entity.ResponseEntity;
import com.springbootblog.springbootblog.security.IsUser;
import com.springbootblog.springbootblog.service.ContentService;
import com.springbootblog.springbootblog.service.UserService;
import com.springbootblog.springbootblog.util.Util;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@IsUser
@RequestMapping("/api/user")
public class UserController {

    private final String PAGE_SIZE = "10";

    @Autowired
    private UserService userService;

    @Autowired
    private ContentService contentService;

    @Autowired
    private CacheManager cacheManager;

    @ApiOperation("Update user's password")
    @PutMapping("/password")
    public ResponseEntity updateUser(@RequestParam String password,
                                     @AuthenticationPrincipal UsernamePasswordAuthenticationToken token) {
        userService.updatePassword(Util.getCurrentUid(), password);
        User user = (User) token.getPrincipal();
        // Get rid of old cache
        cacheManager.getCache("jwt-cache").evict(user.getUsername());
        return new ResponseEntity(HttpStatus.OK.value(), "Password Changed", null);
    }

    @ApiOperation("Get contents of given user")
    @GetMapping("/contents")
    public ResponseEntity getUserContents(@RequestParam(required = false, defaultValue = "1", value = "page") int page,
                                          @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize) {
        PageHelper.startPage(page, pageSize);
        Page<List<Map<String, Object>>> contents = (Page) contentService.getContentsByAuthorId(Util.getCurrentUid());
        Map<String, Object> data = new HashMap<>(2);
        data.put("articles", contents);
        data.put("count", contents.getPages());
        return new ResponseEntity(HttpStatus.OK.value(), "Successfully Get Contents", data);
    }
}
