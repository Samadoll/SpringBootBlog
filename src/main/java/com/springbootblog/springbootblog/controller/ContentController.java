package com.springbootblog.springbootblog.controller;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.springbootblog.springbootblog.entity.ResponseEntity;
import com.springbootblog.springbootblog.entity.ContentEntity;
import com.springbootblog.springbootblog.security.IsUser;
import com.springbootblog.springbootblog.service.ContentService;
import com.springbootblog.springbootblog.service.TagService;
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
@RequestMapping("/api/content")
@Validated
public class ContentController {

    private final String PAGE_SIZE = "10";

    @Autowired
    private ContentService contentService;

    @Autowired
    private TagService tagService;

    @ApiOperation(value = "Create an article", notes = "Create an article and return article id (cid)")
    @ApiImplicitParam(name = "tags", value = "Article tags, split by comma", required = true)
    @IsUser
    @PostMapping("/create")
    public ResponseEntity createContent(@RequestParam @Length(min = 1, max = 100) String title,
                                        @RequestParam @Length(min = 1) String content,
                                        @RequestParam @Length(min = 1) String tags) {
        String[] tagsArray = tags.split(",");
        if (tagsArray.length == 0) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST.value(), "Please add at least one tag", null);
        }
        int contentId = contentService.createContent(title, content, tagsArray, Util.getCurrentUid());
        return new ResponseEntity(HttpStatus.OK.value(), "Article Created", contentId);
    }

    @ApiOperation(value = "Delete an article")
    @IsUser
    @DeleteMapping("/{cid}")
    public ResponseEntity deleteContent(@PathVariable int cid) {
        ContentEntity contentEntity = contentService.getContent(cid);
        Assert.notNull(contentEntity, "Article Not Exist");
        if (contentEntity.getAuthorId() != Util.getCurrentUid()) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST.value(), "No Access Right", null);
        }
        contentService.deleteContent(cid);
        return new ResponseEntity(HttpStatus.OK.value(), "Article Deleted", null);
    }

    @ApiOperation("Update an article")
    @ApiImplicitParam(name = "tags", value = "Article tags, split by comma", required = true)
    @IsUser
    @PutMapping("/{cid}")
    @Validated
    public ResponseEntity updateContent(@PathVariable int cid,
                                        @RequestParam @Length(min = 1, max = 100) String title,
                                        @RequestParam @Length(min = 1) String content,
                                        @RequestParam @Length(min = 1) String tags) {
        ContentEntity contentEntity = contentService.getContent(cid);
        if (contentEntity.getAuthorId() != Util.getCurrentUid()) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST.value(), "No Access Right", null);
        }
        String[] tagsArray = tags.split(",");
        if (tagsArray.length == 0) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST.value(), "Please add at least one tag", null);
        }
        contentService.updateContent(cid, title, content, tagsArray);
        return new ResponseEntity(HttpStatus.OK.value(), "Article Updated", null);
    }

    @ApiOperation("Get an article by id")
    @GetMapping("/{cid}")
    public ResponseEntity getContent(@PathVariable int cid) {
        Map<String, Object> contentEntity = contentService.getContentWithAuthor(cid);
        Assert.notNull(contentEntity, "Article Not Exist");
        Map<String, Object> data = new HashMap<>(2);
        data.put("article", contentEntity);
        data.put("tags", tagService.getRelationshipsByContentId(cid));
        return new ResponseEntity(HttpStatus.OK.value(), "Article Obtained", data);
    }

    @ApiOperation("Get an editable article by id")
    @GetMapping("/getEditableContent/{cid}")
    public ResponseEntity getEditableContent(@PathVariable int cid) {
        ContentEntity contentEntity = contentService.getContent(cid);
        if (contentEntity == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND.value(), "Article Not Exist", null);
        }
        if (contentEntity.getAuthorId() != Util.getCurrentUid()) {
            return new ResponseEntity(HttpStatus.FORBIDDEN.value(), "Access Denied", null);
        }
        Map<String, Object> data = new HashMap<>(2);
        data.put("article", contentEntity);
        data.put("tags", tagService.getRelationshipsByContentId(cid));
        return new ResponseEntity(HttpStatus.OK.value(), "Article Obtained", data);
    }

    @ApiOperation("Get contents of given user")
    @GetMapping("/myContents")
    public ResponseEntity getUserContents(@RequestParam(required = false, defaultValue = "1", value = "page") int page,
                                          @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize,
                                          @RequestParam(required = false, defaultValue = "", value = "searchString") String search) {
        PageHelper.startPage(page, pageSize);
        Page<List<Map<String, Object>>> contents = (Page) contentService.getContentsByAuthorId(Util.getCurrentUid(), search);
        return handleGetContentsResponse(contents, page);
    }

    @ApiOperation(value = "Get contents in the first page")
    @GetMapping("/contents")
    public ResponseEntity getContents(@RequestParam(required = false, defaultValue = "1", value = "page") int page,
                                      @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize,
                                      @RequestParam(required = false, defaultValue = "", value = "searchString") String search) {
        // Pagination
        PageHelper.startPage(page, pageSize);
        Page<List<Map<String, Object>>> contents = (Page) contentService.getContents(search);
        return handleGetContentsResponse(contents, page);
    }

    @ApiOperation("Get contents by tag")
    @GetMapping("/tag/{tag}")
    public ResponseEntity tags(@PathVariable @Length(min = 1) String tag,
                               @RequestParam(required = false, defaultValue = "1", value = "page") int page,
                               @RequestParam(required = false, defaultValue = PAGE_SIZE, value = "pageSize") int pageSize) {
        PageHelper.startPage(page, pageSize);
        Page<List<Map<String, Object>>> contents = (Page) contentService.getContentByTag(tag);
        return handleGetContentsResponse(contents, page);
    }

    private ResponseEntity handleGetContentsResponse(Page<List<Map<String, Object>>> contents, int page) {
        Map<String, Object> data = new HashMap<>(3);
        data.put("articles", contents);
        data.put("count", contents.getPages());
        data.put("page", page);
        return new ResponseEntity(HttpStatus.OK.value(), "Successfully Get Contents", data);
    }
}
