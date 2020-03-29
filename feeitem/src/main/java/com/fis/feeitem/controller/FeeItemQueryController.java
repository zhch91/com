package com.fis.feeitem.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fis.feeitem.data.FisFeeItem;
import com.fis.feeitem.data.ParamsCollection;
import com.fis.feeitem.service.FisFeeItemQueryService;
import com.fis.feeitem.service.IDicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "/query")
public class FeeItemQueryController {
    @Autowired
    FisFeeItemQueryService fisFeeItemQueryService;
    @Autowired
    IDicService dicService;

    @PostMapping(value="/list")
    public Page<FisFeeItem> getFeeItemList(@RequestBody ParamsCollection paramsCollection, HttpSession httpSession, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            System.out.println(bindingResult.getFieldError().getDefaultMessage());
        }
        return fisFeeItemQueryService.queryFeeItem(paramsCollection);
    }

    @PostMapping(value="/one", produces = "application/json;charset=UTF-8")
    public String queryOne(@RequestBody ParamsCollection paramsCollection){
        JSONObject reJson = new JSONObject();
        FisFeeItem fisFeeItem = fisFeeItemQueryService.queryFeeItemOne(paramsCollection);
        reJson.put("items",JSONObject.toJSON(fisFeeItem));
        reJson.put("dices",generatePageDic());
        return reJson.toJSONString();
    }

    @PostMapping(value="/getNewJson", produces = "application/json;charset=UTF-8")
    public String getNewJson(){
        JSONObject reJson = new JSONObject();
        FisFeeItem fisFeeItem = new FisFeeItem();
        reJson.put("items",JSONObject.toJSON(fisFeeItem));
        reJson.put("dices",generatePageDic());
        return reJson.toJSONString();
    }

    private JSONObject generatePageDic(){
        JSONArray dices = new JSONArray();
        JSONObject scopeDic = new JSONObject();
        scopeDic.put("id","scopeDic");
        scopeDic.put("tableName","commDic");
        scopeDic.put("type","scope");
        scopeDic.put("inUse","1");
        dices.add(scopeDic);
        JSONObject itemDic = new JSONObject();
        itemDic.put("id","itemDic");
        itemDic.put("tableName","commDic");
        itemDic.put("type","item");
        itemDic.put("inUse","1");
        dices.add(itemDic);
        JSONObject unitDic = new JSONObject();
        unitDic.put("id","unitDic");
        unitDic.put("tableName","commDic");
        unitDic.put("type","unit");
        unitDic.put("inUse","1");
        dices.add(unitDic);
        String reDices = dicService.batchGetDices(dices.toJSONString());
        return JSONObject.parseObject(reDices);
    }
}
