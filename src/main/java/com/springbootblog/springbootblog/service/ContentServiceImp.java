package com.springbootblog.springbootblog.service;

import com.springbootblog.springbootblog.entity.ContentEntity;
import com.springbootblog.springbootblog.mapper.ContentMapper;
import com.springbootblog.springbootblog.mapper.RelationshipsMapper;
import com.springbootblog.springbootblog.mapper.TagsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class ContentServiceImp implements ContentService {

    @Autowired
    private TagsMapper tagsMapper;

    @Autowired
    private ContentMapper contentMapper;

    @Autowired
    private RelationshipsMapper relationshipsMapper;

    private final TagService tagService = new TagServiceImp();

    @Transactional
    @Override
    public int createContent(String title, String content, String[] tags, int authorId) {
        List<Integer> tagIDs = tagService.getTagIDs(tags);
        ContentEntity contentEntity = new ContentEntity(null, title, content, authorId, System.currentTimeMillis());
        contentMapper.createContent(contentEntity);
        for (int tid: tagIDs) {
            relationshipsMapper.createRelationship(contentEntity.getCid(), tid);
        }
        return contentEntity.getCid();
    }

    @Transactional
    @Override
    public void updateContent(int cid, String title, String content, String[] tags) {
        relationshipsMapper.deleteRelationshipsByContentId(cid);
        List<Integer> tagIDs = tagService.getTagIDs(tags);
        contentMapper.updateContent(cid, title, content);
        for (int tid: tagIDs) {
            relationshipsMapper.createRelationship(cid, tid);
        }
    }

    @Transactional
    @Override
    public void deleteContent(int cid) {
        contentMapper.deleteContent(cid);
        relationshipsMapper.deleteRelationshipsByContentId(cid);
    }

    @Override
    public ContentEntity getContent(int cid) {
        return contentMapper.findContentByContentId(cid);
    }

    @Override
    public List<Map<String, Object>> getContents() {
        return contentMapper.findContents();
    }

    @Override
    public List<Map<String, Object>> getContentByTag(String tag) {
        return contentMapper.findContentsByTag(tag);
    }

    @Override
    public List<Map<String, Object>> getContentsByAuthorId(int authorId) {
        return contentMapper.findContentsByAuthorId(authorId);
    }
}
