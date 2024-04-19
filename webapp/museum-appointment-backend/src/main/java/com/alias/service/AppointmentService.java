package com.alias.service;

import com.alias.model.entity.Appointment;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.extension.service.IService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 预约服务
 */
public interface AppointmentService extends IService<Appointment> {

    /**
     * 获取用户预约列表
     *
     * @return 用户预约列表
     */
    List<Appointment> getAppointmentListByPhone(String phone);

    /**
     * 新增预约
     *
     * @param appointeeName 预约人姓名
     * @param visitorNumber 参观人数
     * @param visitorInfo   参观人信息
     * @param phone         手机号
     * @param date          预约日期
     * @param time          预约时间段
     * @return 新预约 id
     */
    int addAppointment(HttpServletRequest request, String appointeeName, String visitorNumber, String visitorInfo, String phone, String date, String time);

    /**
     * 更新预约
     *
     * @param id            预约 id
     * @param appointeeName 预约人姓名
     * @param visitorNumber 参观人数
     * @param visitorInfo   参观人信息
     * @param phone         手机号
     * @param date          预约日期
     * @param time          预约时间段
     * @param comment       备注
     */
    boolean updateAppointment(Integer id, String appointeeName, String visitorNumber, String visitorInfo, String phone, String date, String time, String comment);

    /**
     * 删除预约
     *
     * @param id 预约 id
     */
    boolean deleteAppointment(Integer id);

    /**
     * 确认预约
     *
     * @param id 预约 id
     */
    boolean confirmAppointment(Integer id);

    /**
     * 拒绝预约
     *
     * @param id 预约 id
     */
    boolean rejectAppointment(Integer id);

}
