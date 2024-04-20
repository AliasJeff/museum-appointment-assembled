-- 创建库
create database if not exists museum;

-- 切换库
use museum;

-- 用户表
drop table if exists user;
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    unionId      varchar(256)                           null comment '微信开放平台id',
    mpOpenId     varchar(256)                           null comment '公众号openId',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    index idx_unionId (unionId)
) comment '用户' collate = utf8mb4_unicode_ci;

drop table if exists appointment;
CREATE TABLE if not exists appointment (
      id bigint AUTO_INCREMENT PRIMARY KEY,
      userId bigint default null comment '用户id',
      appointeeName VARCHAR(255) NOT NULL comment '预约人姓名',
      visitorNumber VARCHAR(255) NOT NULL comment '参观人数',
      visitorInfo VARCHAR(255) NOT NULL comment '参观人信息',
      phone VARCHAR(255) NOT NULL comment '手机号',
      date DATE NOT NULL comment '预约日期',
      time varchar(255) not null comment '预约时间段',
      status INT NOT NULL comment '预约状态 0-pending 1-confirmed 2-rejected',
      comment VARCHAR(255) null default null comment '备注',
      createTime DATETIME default CURRENT_TIMESTAMP NOT NULL comment '创建时间',
      updateTime DATETIME default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
      isDelete     tinyint      default 0                 not null comment '是否删除',
      index idx_userid (userId)
);
