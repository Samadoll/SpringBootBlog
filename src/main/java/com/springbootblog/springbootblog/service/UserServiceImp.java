package com.springbootblog.springbootblog.service;

import com.springbootblog.springbootblog.entity.UserEntity;
import com.springbootblog.springbootblog.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public void register(String username, String password) {
        UserEntity userEntity = userMapper.findByUsername(username);
        Assert.isNull(userEntity, "User Already Existed");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        int status = userMapper.createUser(username, encoder.encode(password), System.currentTimeMillis());
        Assert.isTrue(status == 1, "Registration Failed");
    }

    @Override
    public UserEntity findUser(String username) {
        UserEntity userEntity = userMapper.findByUsername(username);
        Assert.notNull(userEntity, "User Not Exist");
        return userEntity;
    }

    @Override
    public UserEntity login(String username, String password) {
        UserEntity userEntity = userMapper.findByUsernameAndPassword(username, password);
        Assert.notNull(userEntity, "Invalid Username Or Password");
        return userEntity;
    }

    @Override
    public void updatePassword(int uid, String password) {
        userMapper.updatePassword(uid, new BCryptPasswordEncoder().encode(password));
    }
}
