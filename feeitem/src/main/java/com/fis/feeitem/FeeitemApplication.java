package com.fis.feeitem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableEurekaClient
@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing
public class FeeitemApplication {

    public static void main(String[] args) {
        SpringApplication.run(FeeitemApplication.class, args);
    }

}
