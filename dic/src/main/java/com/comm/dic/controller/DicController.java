package com.comm.dic.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.comm.dic.data.ParamsCollection;
import com.comm.dic.service.CommDicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping(value="/")
public class DicController {
    @Autowired
    CommDicService commDicService;

    @RequestMapping(value="/batch")
    public String batchGetDices(@RequestBody String dices){
        JSONArray jsonArray = JSONArray.parseArray(dices);
        String dicJsons = commDicService.batchGetDices(jsonArray);
        return dicJsons;
    }

    @RequestMapping(value="/jsBatch")
    public String batchGetDicesFromJs(@RequestBody ParamsCollection pc){
        ArrayList dices = (ArrayList) pc.getParameter("dices");
        JSONArray jsonArray = JSONArray.parseArray(JSONObject.toJSONString(dices));
        String dicJsons = commDicService.batchGetDices(jsonArray);
        return dicJsons;
    }
}
