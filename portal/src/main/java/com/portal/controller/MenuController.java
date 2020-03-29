package com.portal.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.portal.data.ParamsCollection;
import com.portal.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value="/menus")
public class MenuController {

    @Autowired
    SecurityService securityService;

    @RequestMapping(value="/getMenus",method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
    public String getMenus(@RequestBody ParamsCollection paramsCollection, HttpSession httpSession, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            System.out.println(bindingResult.getFieldError().getDefaultMessage());
        }
        String userId = (String) paramsCollection.getParameter("userId");
        JSONObject reJson = new JSONObject();
        if(httpSession.getAttribute("userId")==null) {
            reJson.put("code","error");
            reJson.put("message","登录失效，请重新登录！");
        }else if(userId.equals(httpSession.getAttribute("userId"))){
            reJson.put("code","success");
            JSONArray menus = securityService.getMenus(userId);
            reJson.put("menus",menus);
        }else if(httpSession.getAttribute("userId")!=null){
            reJson.put("code","error");
            reJson.put("message","用户信息被篡改！");
        }
        return reJson.toString();
    }
}
