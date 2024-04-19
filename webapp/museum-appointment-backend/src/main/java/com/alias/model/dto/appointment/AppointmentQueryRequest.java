package com.alias.model.dto.appointment;

import lombok.Data;

import java.io.Serializable;

/**
 * 预约查询请求
 */
@Data
public class AppointmentQueryRequest implements Serializable {

    /**
     * 预约ID
     */
    private String id;

    /**
     * 用户id
     */
    private String userId;

    /**
     * 预约人姓名
     */
    private String appointeeName;

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

    private static final long serialVersionUID = 1L;
}
