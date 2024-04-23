package com.alias.model.enums;

/**
 * 预约状态枚举
 *
 * @author Jeffery
 */
public enum AppointmentEnum {

    PENDING("待审核", 0),
    APPROVED("已通过", 1),
    REJECTED("已拒绝", 2);

    private final String text;

    private final Integer value;

    AppointmentEnum(String text, Integer value) {
        this.text = text;
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }

    public String getText() {
        return text;
    }
}
