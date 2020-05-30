package com.springbootblog.springbootblog.mapper;

import com.springbootblog.springbootblog.entity.TagEntity;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import java.util.*;

// Tags Mapper for MyBatis
@Mapper
@Repository
public interface TagsMapper {

    @Insert("INSERT INTO `tags` (`name`) VALUES (#{tag.name})")
    @Options(useGeneratedKeys = true, keyProperty = "tag.tid")
    void createTag(@Param("tag") TagEntity tagEntity);

    @Select("SELECT * FROM `tags` WHERE `name` = #{name}")
    TagEntity findTag(@Param("name") String name);
}
