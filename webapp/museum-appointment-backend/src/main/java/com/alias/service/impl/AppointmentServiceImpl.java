package com.alias.service.impl;

import com.alias.mapper.AppointmentMapper;
import com.alias.model.dto.appointment.AppointmentQueryRequest;
import com.alias.model.dto.appointment.AppointmentUpdateRequest;
import com.alias.model.entity.Appointment;
import com.alias.service.AppointmentService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

import static com.alias.model.enums.AppointmentEnum.PENDING;

/**
 * 预约服务实现类
 *
 * @author Jeffery
 */
@Service
@Slf4j
public class AppointmentServiceImpl extends ServiceImpl<AppointmentMapper, Appointment> implements AppointmentService {

    private static final List<String> TIME_LIST = Arrays.asList("08:00-09:50", "10:20-12:00", "14:00-15:20", "15:40-17:00");

    @Resource
    private AppointmentMapper appointmentMapper;

    @Override
    public List<Appointment> getAppointmentList(AppointmentQueryRequest appointmentQueryRequest) {
        String id = appointmentQueryRequest.getId();
        String userId = appointmentQueryRequest.getUserId();
        String appointeeName = appointmentQueryRequest.getAppointeeName();
        String phone = appointmentQueryRequest.getPhone();
        String date = appointmentQueryRequest.getDate();
        String time = appointmentQueryRequest.getTime();
        Integer status = appointmentQueryRequest.getStatus();
        Map<String, Object> columnMap = new HashMap<>();
        Optional.ofNullable(id).ifPresent(value -> columnMap.put("id", value));
        Optional.ofNullable(userId).ifPresent(value -> columnMap.put("userId", value));
        Optional.ofNullable(appointeeName).ifPresent(value -> columnMap.put("appointeeName", value));
        Optional.ofNullable(phone).ifPresent(value -> columnMap.put("phone", value));
        Optional.ofNullable(date).ifPresent(value -> columnMap.put("date", value));
        Optional.ofNullable(time).ifPresent(value -> columnMap.put("time", value));
        Optional.ofNullable(status).ifPresent(value -> columnMap.put("status", value));
        return this.listByMap(columnMap);
    }

    @Override
    public List<String> getAvailableTimeList() {
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("time").groupBy("time");
        queryWrapper.eq("status", PENDING);

        List<Appointment> appointments = appointmentMapper.selectList(queryWrapper);
        appointments.forEach(System.out::println);
        List<String> timeList = new ArrayList<>(TIME_LIST);
        appointments.forEach(appointment -> timeList.remove(appointment.getTime()));
        return timeList;
    }

    @Override
    public List<Appointment> getAppointmentListByNameOrPhone(String nameOrPhone) {
        QueryWrapper<Appointment> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("appointeeName", nameOrPhone).or().like("phone", nameOrPhone);
        return this.list(queryWrapper);
    }

    @Override
    public int addAppointment(HttpServletRequest request, String appointeeName, String visitorNumber, String visitorInfo, String phone, String date, String time) {
        return 0;
    }

    @Override
    public boolean updateAppointment(Integer id, String appointeeName, String visitorNumber, String visitorInfo, String phone, String date, String time, String comment) {
        return false;
    }

    @Override
    public boolean deleteAppointment(Integer id) {
        return false;
    }

    @Override
    public boolean confirmAppointment(Integer id) {
        return false;
    }

    @Override
    public boolean rejectAppointment(Integer id) {
        return false;
    }

    @Override
    public boolean updateAppointment(AppointmentUpdateRequest appointmentUpdateRequest) {
        String id = appointmentUpdateRequest.getId();
        String userId = appointmentUpdateRequest.getUserId();
        String appointeeName = appointmentUpdateRequest.getAppointeeName();
        String phone = appointmentUpdateRequest.getPhone();
        String date = appointmentUpdateRequest.getDate();
        String time = appointmentUpdateRequest.getTime();
        String comment = appointmentUpdateRequest.getComment();
        Integer status = appointmentUpdateRequest.getStatus();
        Appointment appointment = new Appointment();
        Optional.ofNullable(id).ifPresent(value -> appointment.setId(Long.valueOf(value)));
        Optional.ofNullable(userId).ifPresent(appointment::setUserId);
        Optional.ofNullable(appointeeName).ifPresent(appointment::setAppointeeName);
        Optional.ofNullable(phone).ifPresent(appointment::setPhone);
        Optional.ofNullable(date).ifPresent(appointment::setDate);
        Optional.ofNullable(time).ifPresent(appointment::setTime);
        Optional.ofNullable(status).ifPresent(appointment::setStatus);
        Optional.ofNullable(comment).ifPresent(appointment::setComment);
        return this.updateById(appointment);
    }


}
