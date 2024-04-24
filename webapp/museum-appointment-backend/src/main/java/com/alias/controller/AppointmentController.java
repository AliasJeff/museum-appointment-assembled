package com.alias.controller;

import com.alias.common.BaseResponse;
import com.alias.common.ErrorCode;
import com.alias.common.ResultUtils;
import com.alias.exception.BusinessException;
import com.alias.exception.ThrowUtils;
import com.alias.model.dto.appointment.AppointmentAddRequest;
import com.alias.model.dto.appointment.AppointmentQueryRequest;
import com.alias.model.dto.appointment.AppointmentUpdateRequest;
import com.alias.model.entity.Appointment;
import com.alias.service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

import static com.alias.constant.AppointmentConstant.PASSWORD;

/**
 * 预约接口
 *
 * @author Jeffery
 */
@RestController
@RequestMapping("/appointment")
@Slf4j
public class AppointmentController {

    @Resource
    private AppointmentService appointmentService;

    @PostMapping("/add")
    public BaseResponse<Long> addAppointment(@RequestBody AppointmentAddRequest appointmentAddRequest, HttpServletRequest request) {
        if (appointmentAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String appointeeName = appointmentAddRequest.getAppointeeName();
        String visitorNumber = appointmentAddRequest.getVisitorNumber();
        String visitorInfo = appointmentAddRequest.getVisitorInfo();
        String phone = appointmentAddRequest.getPhone();
        String date = appointmentAddRequest.getDate();
        String time = appointmentAddRequest.getTime();

        if (StringUtils.isAnyBlank(appointeeName, visitorNumber, visitorInfo, phone, date, time)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Appointment appointment = new Appointment();
        BeanUtils.copyProperties(appointmentAddRequest, appointment);
        boolean result = appointmentService.save(appointment);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        long newId = appointment.getId();
        return ResultUtils.success(newId);
    }


    @GetMapping("/get")
    public BaseResponse<List<Appointment>> getUserAppointmentList(@RequestParam(required = false) String phone, @RequestParam(required = false) Integer status, @RequestParam(required = false) String appointeeName,HttpServletRequest request) {
        AppointmentQueryRequest appointmentQueryRequest = new AppointmentQueryRequest();
        appointmentQueryRequest.setStatus(status);
        appointmentQueryRequest.setPhone(phone);
        appointmentQueryRequest.setAppointeeName(appointeeName);
        List<Appointment> appointmentList = appointmentService.getAppointmentList(appointmentQueryRequest);
        return ResultUtils.success(appointmentList);
    }

    @GetMapping("/get/available")
    public BaseResponse<List<String>> getAvailableTimeList(HttpServletRequest request) {
        List<String> timeList = appointmentService.getAvailableTimeList();
        return ResultUtils.success(timeList);
    }

    @GetMapping("/get/records")
    public BaseResponse<List<Appointment>> getAppointmentRecords(String param) {
        if (StringUtils.isBlank(param)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        List<Appointment> appointmentList = appointmentService.getAppointmentListByNameOrPhone(param);
        return ResultUtils.success(appointmentList);
    }


    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteAppointmentById(@RequestBody AppointmentUpdateRequest appointmentUpdateRequest) {
        if (appointmentUpdateRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Integer id = Integer.valueOf(appointmentUpdateRequest.getId());
        boolean res = appointmentService.deleteAppointment(id);
        return ResultUtils.success(res);
    }


    @PostMapping("/update")
    public BaseResponse<Boolean> updateAppointmentById(@RequestBody AppointmentUpdateRequest appointmentUpdateRequest) {
        if (appointmentUpdateRequest == null || appointmentUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean res = appointmentService.updateAppointment(appointmentUpdateRequest);
        return ResultUtils.success(res);
    }

    @PostMapping("/auth")
    public BaseResponse<Boolean> authCheck(@RequestParam("password") String password) {
        if (StringUtils.isBlank(password)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        log.info(password);
        log.info(PASSWORD);
        if (!password.equals(PASSWORD)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        return ResultUtils.success(true);
    }
}
