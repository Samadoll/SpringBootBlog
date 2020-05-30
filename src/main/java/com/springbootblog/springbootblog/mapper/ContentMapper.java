package com.springbootblog.springbootblog.mapper;

import com.springbootblog.springbootblog.entity.ContentEntity;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;
import org.springframework.stereotype.Repository;
import java.util.*;

// Content Mapper for MyBatis
@Mapper
@Repository
public interface ContentMapper {
    // Create Content
    @Insert("INSERT INTO `content` (`title`, `content`, `author_id`, `create_time`) " +
            "VALUES (#{content.title}, #{content.content}, #{content.authorId}, #{content.createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "content.cid") // AutoIncrement for cid
    void createContent(@Param("content") ContentEntity contentEntity);

    @Results(id = "contentMap", value = {
            @Result(property = "cid", column = "cid"),
            @Result(property = "title", column = "title"),
            @Result(property = "content", column = "content"),
            @Result(property = "authorId", column = "author_id"),
            @Result(property = "createTime", column = "create_time", jdbcType = JdbcType.BIGINT)
    })
    @Select("SELECT * FROM `content` WHERE cid = #{cid}")
    ContentEntity findContentByCid(@Param("cid") int cid);

    @Delete("DELETE FROM `content` WHERE `cid` = #{cid}")
    void deleteContent(@Param("cid") int cid);

    @Update("UPDATE `content` SET `title` = #{title}, `content` = #{content} WHERE `cid` = #{cid}")
    void updateContent(@Param("cid") int cid, @Param("title") String title, @Param("content") String content);

    @Select("SELECT * FROM `content` ORDER BY `create_time` DESC")
    @ResultMap("contentMap")
    List<ContentEntity> findContents();

    @Select("SELECT `tags`.`tid`, `tags`.`name`, `content`.`cid`, `content`.`title`, `content`.`content`, `content`.`author_id`, `content`.`create_time` " +
            "FROM tags LEFT JOIN relationships ON tags.tid = relationships.tid " +
            "LEFT JOIN content ON relationships.cid = content.cid WHERE tags.`name` = #{tag} " +
            "ORDER BY `content`.`create_time` DESC")
    List<Map<String, Object>> findContentsByTag(@Param("tag") String tag);

    @Select("SELECT * FROM `content` WHERE `author_id` = #{authorId} ORDER BY `create_time` DESC")
    @ResultMap("contentMap")
    List<ContentEntity> findContentsByAuthorId(@Param("authorId") int authorId);
}
