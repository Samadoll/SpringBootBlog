package com.springbootblog.springbootblog.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TagEntity {
    private Integer tid;
    private String name;
}
