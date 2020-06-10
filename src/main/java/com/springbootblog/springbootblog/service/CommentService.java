package com.springbootblog.springbootblog.service;

import com.springbootblog.springbootblog.entity.CommentEntity;
import java.util.*;

public interface CommentService {
    int createComment(Integer parentId, int contentId, int authorId, String comment);
    void deleteComment(int id);
    CommentEntity getComment(int id);
    List<Map<String, Object>> getCommentsByContentId(int cid);
}
