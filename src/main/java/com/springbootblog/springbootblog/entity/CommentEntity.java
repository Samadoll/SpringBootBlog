package com.springbootblog.springbootblog.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentEntity {
    private Integer id;
    private Integer parentId;
    private Integer contentId;
    private Integer authorId;
    private String comment;
    private Long createTime;
}
