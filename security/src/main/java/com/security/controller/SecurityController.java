package com.security.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.security.base.dao.ICommUserDao;
import com.security.base.data.CommMenu;
import com.security.base.data.CommUser;
import com.security.base.service.CommMenuService;
import com.security.token.UserCheckToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value="/security")
public class SecurityController {

    @Autowired
    ICommUserDao iCommUserDao;
    @Autowired
    CommMenuService commMenuService;

    @RequestMapping(value="/checkup")
    public String getCheckup(@RequestBody UserCheckToken userCheckToken){
        CommUser commUser = iCommUserDao.findByUserIdAndUserPass(userCheckToken.getUserId(),userCheckToken.getUserPass());
        if(commUser!=null){
            return "index";
        }else{
            return "login";
        }
    }

    @RequestMapping(value="/getMenus")
    public JSONArray getMenus(@RequestBody String userId){
        List<CommMenu> menuList = commMenuService.findMenusByUserIdAndParent(userId,"0");
        JSONArray jsonArray = JSONArray.parseArray(JSON.toJSONString(menuList));
        for(int i=0;i<jsonArray.size();i++){
            JSONObject menu= jsonArray.getJSONObject(i);
            if(menu.getString("isLeaf").equals("0")){
                menu.put("children",commMenuService.findMenusByUserIdAndParent(userId,menu.getString("menuId")));
            }
        }
        return jsonArray;
    }
}
