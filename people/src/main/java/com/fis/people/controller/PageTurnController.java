package com.fis.people.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fis.people.service.IDicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/page")
public class PageTurnController {

    @GetMapping(value="/list/edit")
    public ModelAndView toPagePeopleList(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/list/peopleListForEdit");
        return modelAndView;
    }

    @GetMapping(value="/edit")
    public ModelAndView toPageEdit(HttpServletRequest request){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/edit/peopleInfoEdit");
        return modelAndView;
    }
    @GetMapping(value="/detail")
    public ModelAndView toPageDetail(HttpServletRequest request){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/edit/peopleInfoDetail");
        return modelAndView;
    }
}
