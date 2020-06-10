package com.springbootblog.springbootblog.service;

import com.springbootblog.springbootblog.entity.CommentEntity;
import com.springbootblog.springbootblog.mapper.CommentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class CommentServiceImp implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Transactional
    @Override
    public int createComment(Integer parentId, int contentId, int authorId, String comment) {
        CommentEntity commentEntity = new CommentEntity(null, parentId, contentId, authorId, comment, System.currentTimeMillis());
        commentMapper.createComment(commentEntity);
        return commentEntity.getId();
    }

    @Transactional
    @Override
    public void deleteComment(int id) {
        commentMapper.deleteComment(id);
    }

    @Override
    public CommentEntity getComment(int id) {
        return commentMapper.findCommentById(id);
    }

    @Override
    public List<Map<String, Object>> getCommentsByContentId(int cid) {
        return commentMapper.getCommentsByContentId(cid);
    }
}
