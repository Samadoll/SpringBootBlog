package com.springbootblog.springbootblog.service;

import com.springbootblog.springbootblog.entity.TagEntity;
import com.springbootblog.springbootblog.mapper.RelationshipsMapper;
import com.springbootblog.springbootblog.mapper.TagsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TagServiceImp implements TagService {

    @Autowired
    private RelationshipsMapper relationshipsMapper;

    @Autowired
    private TagsMapper tagsMapper;

    @Override
    public List<Map<String, Object>> getRelationshipsByContentId(int cid) {
        return relationshipsMapper.findRelationshipsByContentId(cid);
    }

    @Override
    public List<Integer> getTagIDs(String[] tags) {
        List<Integer> tagIds = new ArrayList<>();
        for (String tag: tags) {
            TagEntity tagEntity = getOrCreate(tag);
            tagIds.add(tagEntity.getTid());
        }
        return tagIds;
    }

    @Override
    public TagEntity getOrCreate(String tag) {
        TagEntity tagEntity = tagsMapper.findTag(tag);
        if (tagEntity == null) {
            tagEntity = new TagEntity(null, tag);
            tagsMapper.createTag(tagEntity);
        }
        return tagEntity;
    }
}
