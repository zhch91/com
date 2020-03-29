package com.fis.people.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fis.people.data.FisPeopleInfo;
import com.fis.people.data.ParamsCollection;
import com.fis.people.service.FisPeopleInfoQueryService;
import com.fis.people.service.IDicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "/query")
public class PeopleQueryController {

    @Autowired
    FisPeopleInfoQueryService fisPeopleInfoQueryService;
    @Autowired
    IDicService dicService;

    @PostMapping(value="/list")
    public Page<FisPeopleInfo> getPeopleList(@RequestBody ParamsCollection paramsCollection, HttpSession httpSession, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            System.out.println(bindingResult.getFieldError().getDefaultMessage());
        }
        return fisPeopleInfoQueryService.queryPeople(paramsCollection);
    }

    @PostMapping(value="/one", produces = "application/json;charset=UTF-8")
    public String queryOne(@RequestBody ParamsCollection paramsCollection){
        JSONObject reJson = new JSONObject();
        FisPeopleInfo fisPeopleInfo = fisPeopleInfoQueryService.queryPeopleOne(paramsCollection);
        reJson.put("people",JSONObject.toJSON(fisPeopleInfo));
        reJson.put("dices",generatePageDic());
        return reJson.toJSONString();
    }

    @PostMapping(value="/getNewJson", produces = "application/json;charset=UTF-8")
    public String getNewJson(){
        JSONObject reJson = new JSONObject();
        FisPeopleInfo fisPeopleInfo = new FisPeopleInfo();
        reJson.put("people",JSONObject.toJSON(fisPeopleInfo));
        reJson.put("dices",generatePageDic());
        return reJson.toJSONString();
    }

    private JSONObject generatePageDic(){
        JSONArray dices = new JSONArray();
        JSONObject sexDic = new JSONObject();
        sexDic.put("id","sexDic");
        sexDic.put("tableName","commDic");
        sexDic.put("type","sex");
        sexDic.put("inUse","1");
        dices.add(sexDic);
        String reDices = dicService.batchGetDices(dices.toJSONString());
        return JSONObject.parseObject(reDices);
    }

}
