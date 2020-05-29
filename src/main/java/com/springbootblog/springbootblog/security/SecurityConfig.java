package com.springbootblog.springbootblog.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.CachingUserDetailsService;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserCache;
import org.springframework.security.core.userdetails.cache.SpringCacheBasedUserCache;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Objects;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private CacheManager cacheManager;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors()
                .and()
                // disable csrf
                .csrf().disable()
                .authorizeRequests()
                .anyRequest().permitAll()
                .and()
                .addFilter(new JwtAuthenticationFilter(authenticationManager()))
                .addFilter(new JwtAuthorizationFilter(authenticationManager(), new CachingUserDetailsService(userDetailsService)))
                // Make Stateless
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        CachingUserDetailsService cachingUserDetailsService = new CachingUserDetailsService(userDetailsService);
        UserCache userCache = new SpringCacheBasedUserCache(Objects.requireNonNull(cacheManager.getCache("jwt-cache")));
        cachingUserDetailsService.setUserCache(userCache);
        auth.eraseCredentials(false);
        auth.userDetailsService(cachingUserDetailsService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    private CachingUserDetailsService cachingUserDetailsService(UserDetailsServiceImpl delegate) {
//        Constructor<CachingUserDetailsService> constructor = null;
//        try {
//            constructor = CachingUserDetailsService.class.getDeclaredConstructor(UserDetailsService.class);
//        } catch (NoSuchMethodException e) {
//            e.printStackTrace();
//        }
//        Assert.notNull(constructor, "CachingUserDetailsService constructor is null");
//        constructor.setAccessible(true);
//        return BeanUtils.instantiateClass(constructor, delegate);
//    }
}
