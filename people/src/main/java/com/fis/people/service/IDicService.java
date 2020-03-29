package com.fis.people.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("dic-service")
public interface IDicService {

    @PostMapping(value="/batch",consumes = MediaType.APPLICATION_JSON_VALUE)
    public String batchGetDices(@RequestBody String dices);
}
