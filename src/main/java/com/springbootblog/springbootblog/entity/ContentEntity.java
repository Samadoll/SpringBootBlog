package com.springbootblog.springbootblog.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentEntity {
    private Integer cid;
    private String title;
    private String content;
    private Integer authorId;
    private Long createTime;
}
