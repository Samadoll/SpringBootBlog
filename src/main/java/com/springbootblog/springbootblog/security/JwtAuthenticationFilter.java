package com.springbootblog.springbootblog.security;

import com.springbootblog.springbootblog.entity.ResponseEntity;
import com.springbootblog.springbootblog.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springbootblog.springbootblog.util.Util;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    // Setup AuthenticationManager
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        super();
        setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // Get username and password from post request
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
        setDetails(request, token);
        // User AuthenticationManager to Authenticate
        return getAuthenticationManager().authenticate(token);
    }

    // Send back encrypted token after successful authentication
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        handleResponse(request, response, authResult, null);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        handleResponse(request, response, null, failed);
    }

    private void handleResponse(HttpServletRequest request, HttpServletResponse response, Authentication authResult,
                                AuthenticationException failed) throws IOException, ServletException {
        // User Spring Jackson to convert Entity to Json
        ObjectMapper mapper = new ObjectMapper();
        ResponseEntity responseEntity = new ResponseEntity();
        response.setHeader("Content-Type", "application/json;charset=UTF-8");
        if (authResult != null) {
            // Successful request
            User user = (User) authResult.getPrincipal();
            String token = JwtUtil.sign(user.getUsername(), user.getPassword());
            responseEntity.setStatus(HttpStatus.OK.value());
            responseEntity.setMessage("Successfully Logged In");
            Map<String, Object> dataMap = new HashMap<>(3);
            dataMap.put("username", user.getUsername());
            dataMap.put("uid", Util.getCurrentUid());
            dataMap.put("token", "Bearer " + token);
            responseEntity.setData(dataMap);
            response.setStatus(HttpStatus.OK.value());
        } else {
            responseEntity.setStatus(HttpStatus.BAD_REQUEST.value());
            responseEntity.setMessage("Invalid Username Or Password");
            responseEntity.setData(null);
            response.setStatus(HttpStatus.BAD_REQUEST.value());
        }
        response.getWriter().write(mapper.writeValueAsString(responseEntity));
    }
}
