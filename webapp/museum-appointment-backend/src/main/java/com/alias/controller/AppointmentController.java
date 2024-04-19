package com.alias.controller;

import com.alias.common.BaseResponse;
import com.alias.common.ErrorCode;
import com.alias.common.ResultUtils;
import com.alias.exception.BusinessException;
import com.alias.model.dto.appointment.AppointmentAddRequest;
import com.alias.model.dto.appointment.AppointmentQueryRequest;
import com.alias.model.dto.appointment.AppointmentUpdateRequest;
import com.alias.model.entity.Appointment;
import com.alias.service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 预约接口
 */
@RestController
@RequestMapping("/appointment")
@Slf4j
public class AppointmentController {

    @Resource
    private AppointmentService appointmentService;

    @PostMapping("/add")
    public BaseResponse<Integer> addAppointment(@RequestBody AppointmentAddRequest appointmentAddRequest, HttpServletRequest request) {
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

        int result = appointmentService.addAppointment(request, appointeeName, visitorNumber, visitorInfo, phone, date, time);

        return ResultUtils.success(result);
    }

    @GetMapping("/get")
    public BaseResponse<List<Appointment>> getUserAppointmentList(@RequestBody AppointmentQueryRequest appointmentQueryRequest, HttpServletRequest request) {
        if (appointmentQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        List<Appointment> appointmentList = appointmentService.getAppointmentListByPhone(appointmentQueryRequest.getPhone());
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
}
