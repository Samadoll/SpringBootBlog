package com.springbootblog.springbootblog.service;

import com.springbootblog.springbootblog.entity.TagEntity;
import java.util.*;

public interface TagService {
    List<Map<String, Object>> getRelationshipsByContentId(int cid);
    List<Integer> getTagIDs(String[] tags);
    TagEntity getOrCreate(String tag);
}
