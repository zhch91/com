package com.fis.feeitem.controller;

import com.alibaba.fastjson.JSONObject;
import com.fis.feeitem.data.ParamsCollection;
import com.fis.feeitem.service.FisFeeItemEditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/edit")
public class FeeItemEditController {

    @Autowired
    FisFeeItemEditService fisFeeItemEditService;

    @PostMapping(value="/save")
    public String saveFeeItem(@RequestBody ParamsCollection paramsCollection){
        JSONObject reJson = fisFeeItemEditService.saveFeeItem(paramsCollection);
        return reJson.toJSONString();
    }

    @PostMapping(value="/delete")
    public String deletePeopleInfo(@RequestBody ParamsCollection paramsCollection){
        fisFeeItemEditService.deleteFeeItem(paramsCollection);
        return "{}";
    }
}
