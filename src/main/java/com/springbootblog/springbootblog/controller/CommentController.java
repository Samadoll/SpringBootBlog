package com.springbootblog.springbootblog.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.springbootblog.springbootblog.entity.ResponseEntity;
import com.springbootblog.springbootblog.entity.CommentEntity;
import com.springbootblog.springbootblog.security.IsUser;
import com.springbootblog.springbootblog.service.CommentService;
import com.springbootblog.springbootblog.util.Util;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment")
@Validated
public class CommentController {

    private final String PAGE_SIZE = "10";

    @Autowired
    CommentService commentService;

    @ApiOperation(value = "Create a comment", notes = "Create a commnt and return comment id")
    @IsUser
    @PostMapping("/create")
    public ResponseEntity createComment(@RequestParam String s) {
        // TODO;
        return null;
    }

    @ApiOperation(value = "Delete a comment")
    @IsUser
    @DeleteMapping("/deleteComment/{id}")
    public ResponseEntity deleteComment(@PathVariable int id) {
        CommentEntity commentEntity = commentService.getComment(id);
        Assert.notNull(commentEntity, "Article Not Exist");
        if (commentEntity.getAuthorId() != Util.getCurrentUid()) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST.value(), "No Access Right", null);
        }
        commentService.deleteComment(id);
        return new ResponseEntity(HttpStatus.OK.value(), "Article Deleted", null);
    }

    @ApiOperation("Get contents of given user")
    @GetMapping("/getComments")
    public ResponseEntity getUserContents(@RequestParam(required = false, defaultValue = "1", value = "page") int page,
                                          @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize,
                                          @RequestParam(required = true, value = "contentId") int contentId) {
        PageHelper.startPage(page, pageSize);
        Page<List<Map<String, Object>>> comments = (Page) commentService.getCommentsByContentId(contentId);
        // TODO
        return null;
    }

}
