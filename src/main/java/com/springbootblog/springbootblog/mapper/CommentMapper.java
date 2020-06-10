package com.springbootblog.springbootblog.mapper;

import com.springbootblog.springbootblog.entity.CommentEntity;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;
import org.springframework.stereotype.Repository;
import java.util.*;

// Comment Mapper for MyBatis
@Mapper
@Repository
public interface CommentMapper {

    @Insert("INSERT INTO `comment` (`id`, `parent_id`, `content_id`, `author_id`, `comment`, `create_time`) " +
            "VALUES (#{comment.id}, #{comment.parentId}, #{comment.contentId}, #{comment.authorId}, #{comment.comment}, #{comment.createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "comment.id") // AutoIncrement for id
    void createComment(@Param("comment") CommentEntity commentEntity);

    @Results(id = "commentMap", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "parentId", column = "parent_id"),
            @Result(property = "contentId", column = "content_id"),
            @Result(property = "authorId", column = "author_id"),
            @Result(property = "comment", column = "comment"),
            @Result(property = "createTime", column = "create_time", jdbcType = JdbcType.BIGINT)
    })
    @Select("SELECT * FROM `comment` WHERE id = #{id}")
    CommentEntity findCommentById(@Param("id") int id);

    @Delete("DELETE FROM `comment` WHERE `id` = #{id}")
    void deleteComment(@Param("id") int id);

    @Select("SELECT `comment`.`id`, `comment`.`parent_id`, `comment`.`content_id`, `comment`.`comment`, `user`.`username`, `comment`.`create_time` " +
            "FROM `comment` LEFT JOIN `user` ON `comment`.`author_id` = `user`.`uid` " +
            "WHERE `comment`.`content_id` = #{cid} " +
            "ORDER BY `comment`.`create_time` ASC")
    List<Map<String, Object>> getCommentsByContentId(int cid);
}
