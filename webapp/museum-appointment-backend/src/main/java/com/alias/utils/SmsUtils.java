package com.alias.utils;

import com.alias.config.SmsConfig;
import com.aliyun.auth.credentials.Credential;
import com.aliyun.auth.credentials.provider.StaticCredentialProvider;
import com.aliyun.sdk.service.dysmsapi20170525.AsyncClient;
import com.aliyun.sdk.service.dysmsapi20170525.models.SendSmsRequest;
import com.aliyun.sdk.service.dysmsapi20170525.models.SendSmsResponse;
import com.aliyun.sdk.service.dysmsapi20170525.models.SendSmsResponseBody;
import darabonba.core.client.ClientOverrideConfiguration;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static com.alias.constant.SmsConstant.FAIL_TEMPLATE_CODE;
import static com.alias.constant.SmsConstant.SUCCESS_TEMPLATE_CODE;

/**
 * 短信工具类
 *
 * @author Jeffery
 */
@Component
public class SmsUtils {

    @Resource
    private SmsConfig smsConfig;

    public String generateTemplateParam(String templateCode, String name, String date, String time, String reason) {

        if (Objects.equals(templateCode, SUCCESS_TEMPLATE_CODE)) {
            return "{\"name\":\"" + name + "\",\"date\":\"" + date + "\",\"time\":\"" + time + "\"}";
        } else if (Objects.equals(templateCode, FAIL_TEMPLATE_CODE)) {
            return "{\"name\":\"" + name + "\",\"date\":\"" + date + "\",\"time\":\"" + time + "\",\"reason\":\"" + reason + "\"}";
        } else {
            throw new IllegalArgumentException("Invalid template code: " + templateCode);
        }
    }

    public String sendSms(String phoneNumbers, String signName, String templateCode, String templateParam) throws ExecutionException, InterruptedException {
        StaticCredentialProvider provider = StaticCredentialProvider.create(Credential.builder()
                .accessKeyId(smsConfig.getAccessKey())
                .accessKeySecret(smsConfig.getSecretKey())
                .build());

        // Configure the Client
        AsyncClient client = AsyncClient.builder()
                .region("cn-hangzhou") // Region ID
                .credentialsProvider(provider)
                .overrideConfiguration(
                        ClientOverrideConfiguration.create()
                                .setEndpointOverride("dysmsapi.aliyuncs.com")
                )
                .build();

        // Parameter settings for API request
        SendSmsRequest sendSmsRequest = SendSmsRequest.builder()
                .phoneNumbers(phoneNumbers)
                .signName(signName)
                .templateCode(templateCode)
                .templateParam(templateParam)
                .build();

        // Asynchronously get the return value of the API request
        CompletableFuture<SendSmsResponse> response = client.sendSms(sendSmsRequest);
        // Synchronously get the return value of the API request
        SendSmsResponse resp = response.get();
        String code = resp.getBody().getCode();
//        System.out.println(new Gson().toJson(resp));
//        System.out.println("code: " + code);

        // Finally, close the client
        client.close();

        return code;
    }
}
