package com.fis.people.controller;

import com.alibaba.fastjson.JSONObject;
import com.fis.people.data.ParamsCollection;
import com.fis.people.service.FisPeopleInfoEditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/edit")
public class PeopleEditController {

    @Autowired
    FisPeopleInfoEditService fisPeopleInfoEditService;

    @PostMapping(value="/save")
    public String savePeopleInfo(@RequestBody ParamsCollection paramsCollection){
        JSONObject reJson = fisPeopleInfoEditService.savePeople(paramsCollection);
        return reJson.toJSONString();
    }

    @PostMapping(value="/delete")
    public String deletePeopleInfo(@RequestBody ParamsCollection paramsCollection){
        fisPeopleInfoEditService.deletePeople(paramsCollection);
        return "{}";
    }

}
