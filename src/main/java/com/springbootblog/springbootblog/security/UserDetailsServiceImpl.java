package com.springbootblog.springbootblog.security;

import com.springbootblog.springbootblog.entity.UserEntity;
import com.springbootblog.springbootblog.mapper.UserMapper;
import com.springbootblog.springbootblog.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = userMapper.findByUsername(username);
        if (userEntity == null) throw new UsernameNotFoundException("User Not Exist");
        Util.setCurrentUid(userEntity.getUid());
        return new User(userEntity.getUsername(), userEntity.getPassword(), AuthorityUtils.createAuthorityList(userEntity.getRole()));
    }
}
