package com.springbootblog.springbootblog.controller;

import com.springbootblog.springbootblog.entity.ResponseEntity;
import com.springbootblog.springbootblog.entity.UserEntity;
import com.springbootblog.springbootblog.security.IsUser;
import com.springbootblog.springbootblog.service.UserService;
import com.springbootblog.springbootblog.util.Util;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.Cache;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@IsUser
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

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

    @ApiOperation("Validate Token on Begin")
    @GetMapping("/checkAuth")
    public ResponseEntity checkAuth(@AuthenticationPrincipal UsernamePasswordAuthenticationToken token) {
        User user = (User) token.getPrincipal();
        Cache.ValueWrapper cache = cacheManager.getCache("jwt-cache").get(user.getUsername());
        if (cache == null) return new ResponseEntity(HttpStatus.UNAUTHORIZED.value(), "Please Log In", null);
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setUid(Util.getCurrentUid());
        return new ResponseEntity(HttpStatus.OK.value(), "OK", userEntity);
    }

    @ApiOperation("Get User Info")
    @GetMapping("/getInfo")
    public ResponseEntity getUserInfo() {
        UserEntity userEntity = userService.getUserInfo(Util.getCurrentUid());
        return new ResponseEntity(HttpStatus.OK.value(), "OK", userEntity);
    }

    @ApiOperation("Log Out")
    @PostMapping("/logout")
    public ResponseEntity logOut(@AuthenticationPrincipal UsernamePasswordAuthenticationToken token) {
        User user = (User) token.getPrincipal();
        // Get rid of old cache
        cacheManager.getCache("jwt-cache").evict(user.getUsername());
        return new ResponseEntity(HttpStatus.OK.value(), "Logged Out", null);
    }

}
