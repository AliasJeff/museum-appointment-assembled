package com.alias.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@ConfigurationProperties(prefix = "sms.api")
@Data
public class SmsConfig {

    private String accessKey;

    private String secretKey;

    private String signName;

    private String templateCode;

    private String templateParam;



}
