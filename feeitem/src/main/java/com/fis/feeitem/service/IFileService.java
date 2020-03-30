package com.fis.feeitem.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("file-service")
public interface IFileService {

    @PostMapping(value="/fileList")
    public String getFileList(@RequestBody String applyId);
}
