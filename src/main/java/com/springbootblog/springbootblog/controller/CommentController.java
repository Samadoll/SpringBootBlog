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

    @ApiOperation(value = "Create a comment", notes = "Create a comment and return comment id")
    @IsUser
    @PostMapping("/create")
    public ResponseEntity createComment(@RequestParam(required = false) Integer parentId,
                                        @RequestParam int contentId,
                                        @RequestParam @Length(min = 1, max = 500) String comment) {
        if (comment.length() == 0) return new ResponseEntity(HttpStatus.BAD_REQUEST.value(), "Comment cannot be empty.", null);
        int commentId = commentService.createComment(parentId, contentId, Util.getCurrentUid(), comment);
        return new ResponseEntity(HttpStatus.OK.value(), "Comment Created", commentId);
    }

    @ApiOperation(value = "Delete a comment")
    @IsUser
    @DeleteMapping("/deleteComment/{id}")
    public ResponseEntity deleteComment(@PathVariable int id) {
        CommentEntity commentEntity = commentService.getComment(id);
        Assert.notNull(commentEntity, "Comment Not Exist");
        if (commentEntity.getAuthorId() != Util.getCurrentUid()) {
            return new ResponseEntity(HttpStatus.FORBIDDEN.value(), "No Access Right", null);
        }
        commentService.deleteComment(id);
        return new ResponseEntity(HttpStatus.OK.value(), "Comment Deleted", null);
    }

    @ApiOperation("Get comments of given content")
    @GetMapping("/getComments")
    public ResponseEntity getComments(@RequestParam(required = false, defaultValue = "1", value = "page") int page,
                                      @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize,
                                      @RequestParam(value = "contentId") int contentId) {
        PageHelper.startPage(page, pageSize, true, true, false);
        Page<List<Map<String, Object>>> comments = (Page) commentService.getCommentsByContentId(contentId);
        Map<String, Object> data = new HashMap<>(3);
        data.put("comments", comments);
        data.put("count", comments.getPages());
        data.put("page", page);
        return new ResponseEntity(HttpStatus.OK.value(), "Successfully Get Comments", data);
    }

}
