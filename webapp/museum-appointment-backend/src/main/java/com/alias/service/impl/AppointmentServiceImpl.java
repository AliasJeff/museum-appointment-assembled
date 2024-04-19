package com.alias.service.impl;

import com.alias.mapper.AppointmentMapper;
import com.alias.model.entity.Appointment;
import com.alias.service.AppointmentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Service
@Slf4j
public class AppointmentServiceImpl extends ServiceImpl<AppointmentMapper, Appointment> implements AppointmentService {

    @Override
    public List<Appointment> getAppointmentListByPhone(String phone) {
        return null;
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


}
