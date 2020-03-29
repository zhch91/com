package com.portal.services;

import com.alibaba.fastjson.JSONArray;
import com.portal.data.UserCheckToken;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.awt.*;

@FeignClient("security-service")
public interface SecurityService {

    @PostMapping(value="/security/checkup",consumes = MediaType.APPLICATION_JSON_VALUE)
    public String checkup(@RequestBody UserCheckToken userCheckToken);

    @PostMapping(value="/security/getMenus",consumes =  MediaType.APPLICATION_JSON_VALUE)
    public JSONArray getMenus(String userId);
}
