package com.springbootblog.springbootblog.mapper;

import com.springbootblog.springbootblog.entity.UserEntity;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;
import org.springframework.stereotype.Repository;

// User Mapper for MyBatis
@Mapper
@Repository
public interface UserMapper {

    @Insert("INSERT INTO `user` (`username`, `password`, `register_time`) " +
            "VALUES (#{username}, #{password}, #{registerTime})")
    int createUser(@Param("username") String username, @Param("password") String password,
                   @Param("registerTime") Long registerTime);

    @Results(id = "userMap", value = {
            @Result(property = "uid", column = "uid"),
            @Result(property = "username", column = "username"),
            @Result(property = "password", column = "password"),
            @Result(property = "role", column = "role"),
            @Result(property = "registerTime", column = "register_time", jdbcType = JdbcType.BIGINT)
    })
    @Select("SELECT * FROM `user` WHERE `username` = #{username} AND `password` = #{password}")
    UserEntity findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

    @Select("SELECT * FROM `user` WHERE `username` = #{username}")
    @ResultMap("userMap")
    UserEntity findByUsername(@Param("username") String username);

    @Select("SELECT * FROM `user` WHERE `uid` = #{uid}")
    @ResultMap("userMap")
    UserEntity findByUid(@Param("uid") int uid);

    @Update("UPDATE `user` SET `password` = #{password} WHERE `uid` = #{uid}")
    void updatePassword(@Param("uid") int uid, @Param("password") String password);
}
