package com.springbootblog.springbootblog.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import java.util.*;

// Relationships Mapper for MyBatis
@Mapper
@Repository
public interface RelationshipsMapper {

    @Insert("INSERT INTO `relationships` (`cid`, `tid`) VALUES (#{cid}, #{tid}")
    void createRelationship(@Param("cid") int cid, @Param("tid") int tid);

    @Select("SELECT `cid`, `relationships`.`tid`, `name` FROM `relationships` LEFT JOIN `tags` ON `relationships`.`tid` = `tags`.`tid` WHERE `cid` = #{cid}")
    List<Map<String, Object>> findRelationshipsByContentId(@Param("cid") int cid);

    @Delete("DELETE FROM `relationships` WHERE cid = #{cid}")
    void deleteRelationshipsByContentId(@Param("cid") int cid);
}
