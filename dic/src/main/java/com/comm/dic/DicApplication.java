package com.comm.dic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class DicApplication {

    public static void main(String[] args) {
        SpringApplication.run(DicApplication.class, args);
    }

}
