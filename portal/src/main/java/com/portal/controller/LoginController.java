package com.portal.controller;

import com.portal.data.UserCheckToken;
import com.portal.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@RestController
@RequestMapping("/")
public class LoginController {

    @Autowired
    SecurityService securityService;

    @RequestMapping(value="/",method = RequestMethod.GET)
    public ModelAndView index(ModelAndView modelAndView){
        modelAndView.setViewName("login");
        return modelAndView;
    }

    @RequestMapping(value="/login",method = RequestMethod.GET)
    public ModelAndView login(ModelAndView modelAndView){
        modelAndView.setViewName("login");
        return modelAndView;
    }

    @PostMapping(value="/login")
    public ModelAndView postLogin(ModelAndView modelAndView, @Valid UserCheckToken userCheckToken, BindingResult bindingResult,HttpSession httpSession){
        if(bindingResult.hasErrors()){
            modelAndView.addObject("error",bindingResult.getFieldError().getDefaultMessage());
            modelAndView.setViewName("login");
            return modelAndView;
        }
        String result = securityService.checkup(userCheckToken);
        if("login".equals(result)){
            modelAndView.addObject("error","用户名或密码错误");
        }else if("index".equals(result)){
            httpSession.setAttribute("userId",userCheckToken.getUserId());
        }
        modelAndView.setViewName("redirect:/portal/"+result);
        return modelAndView;
    }
}
