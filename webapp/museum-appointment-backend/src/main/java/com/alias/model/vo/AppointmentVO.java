package com.alias.model.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 预约记录VO
 */
@Data
public class AppointmentVO implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * 用户id
     */
    private String userId;

    /**
     * 预约人姓名
     */
    private String appointeeName;

    /**
     * 参观人数
     */
    private String visitorNumber;

    /**
     * 参观人信息
     */
    private String visitorInfo;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 预约日期
     */
    private String date;

    /**
     * 预约时间段
     */
    private String time;

    /**
     * 预约状态 0-pending 1-confirmed 2-rejected
     */
    private Integer status;

    /**
     * 备注
     */
    private String comment;

    /**
     * 创建时间
     */
    private String createTime;

    private static final long serialVersionUID = 1L;
}
