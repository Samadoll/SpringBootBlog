package com.springbootblog.springbootblog.service;

import com.springbootblog.springbootblog.entity.ContentEntity;
import java.util.*;

public interface ContentService {
    int createContent(String title, String content, String[] tags, int authorId);
    void deleteContent(int cid);
    void updateContent(int cid, String title, String content, String[] tags);
    ContentEntity getContent(int cid);
    List<ContentEntity> getContents();
    List<Map<String, Object>> getContentByTag(String tag);
    List<ContentEntity> getContentsByAuthorId(int authorId);
}