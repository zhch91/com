package com.fis.feeitem.controller;

import org.springframework.web.bind.annotation.GetMapping;
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
        modelAndView.setViewName("/list/itemListForEdit");
        return modelAndView;
    }

    @GetMapping(value="/edit")
    public ModelAndView toPageEdit(HttpServletRequest request){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/edit/itemInfoEdit");
        return modelAndView;
    }
    @GetMapping(value="/detail")
    public ModelAndView toPageDetail(HttpServletRequest request){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/edit/itemInfoDetail");
        return modelAndView;
    }
}
