package com.comm.file.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.comm.file.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping(value = "/")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping(value="/upload")
    public String uploadFile(@RequestParam Map<String,String> map, @RequestParam("file") MultipartFile file){
        if(map.size() >0){
            try{
                JSONObject fileInfo = fileService.uploadFiles(file,map);
                return fileInfo.toJSONString();
            }catch (Exception e){
                return null;
            }
        }
        return null;
    }

    @RequestMapping(value="/download")
    public void downloadFile(@RequestParam(name = "fileId") String fileId, HttpServletRequest request, HttpServletResponse response){
        boolean is = fileService.myDownLoad(fileId,"GBK",response,request);
        if(is)
            System.out.println("成功");
        else
            System.out.println("失败");
    }

    @RequestMapping(value="/fileList")
    public String getFileList(@RequestBody String applyId){
        JSONArray fileList = fileService.getFileList(applyId);
        return fileList.toJSONString();
    }

    @RequestMapping(value="/delete")
    public String deleteFile(@RequestParam(name = "fileId") String fileId){
        boolean is = fileService.deleteFile(fileId);
        JSONObject jo = new JSONObject();
        if(is){
            jo.put("code","success");
            jo.put("message","文件删除成功！");
        }else{
            jo.put("code","error");
            jo.put("message","文件删除失败！");
        }
        return jo.toJSONString();
    }
}
