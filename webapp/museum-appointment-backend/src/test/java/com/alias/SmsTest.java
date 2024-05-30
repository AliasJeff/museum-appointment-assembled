package com.alias;

import com.alias.utils.SmsUtils;
import java.util.concurrent.ExecutionException;


public class SmsTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        SmsUtils smsUtils = new SmsUtils();
        smsUtils.sendSms("19557864422", "非洲博物馆预约系统", "SMS_467440358", "{\"name\":\"Jeffery\",\"date\":\"2024-05-31\",\"time\":\"9:00-12:00\"}");
    }

}
