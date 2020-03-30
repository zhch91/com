package com.comm.file.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.comm.file.dao.ICommFileDao;
import com.comm.file.data.CommFile;
import com.comm.file.data.FileProperties;
import com.comm.file.utils.UploadHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.*;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class FileService {

    @Autowired
    FileProperties fileProperties;
    @Autowired
    ICommFileDao commFileDao;

    public JSONObject uploadFiles(MultipartFile file, Map<String, String> map) throws Exception {
        JSONObject o = new JSONObject();
        try{
            String fileId =  UUID.randomUUID().toString();
            CommFile commFile = new CommFile();
            if("cover".equals(map.get("type"))){
                String applyId = map.get("applyId");
                commFile = commFileDao.findCommFileByApplyId(applyId);
                if(commFile!=null){
                    fileId = commFile.getFileId();
                }
            }
            String fileName = file.getOriginalFilename();
            commFile.setFileId(fileId);
            commFile.setFileName(fileName.substring(0,fileName.lastIndexOf(".")));
            commFile.setFileType(fileName.substring(fileName.lastIndexOf(".")));
            commFile.setFileSize(file.getSize());
            commFile.setApplyId(map.get("applyId"));
            String filePath = UploadHelper.uploadFile(file,fileProperties.getStoreArea(),fileId);
            commFile.setFilePath(filePath);
            commFileDao.save(commFile);
            o = (JSONObject) JSONObject.toJSON(commFile);
        }catch (Exception e){
            e.printStackTrace();
        }
        return o;
    }

    public boolean myDownLoad(String fileId, String encoding, HttpServletResponse response, HttpServletRequest request){
        CommFile commFile = commFileDao.findById(fileId).orElse(null);
        if(commFile!=null){
            String filePath = fileProperties.getStoreArea()+commFile.getFilePath();
            File f = new File(filePath);
            if (!f.exists()) {
                try {
                    response.sendError(404, "File not found!");
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return false;
            }
            String type = commFile.getFileType();
            response.setContentType("application/force-download;charset=UTF-8");
            final String userAgent = request.getHeader("USER-AGENT");
            try {
                String fileName = commFile.getFileName()+"."+type;
                if (StringUtils.contains(userAgent, "MSIE") || StringUtils.contains(userAgent, "Edge")) {// IE浏览器
                    fileName = URLEncoder.encode(fileName, "UTF8");
                } else if (StringUtils.contains(userAgent, "Mozilla")) {// google,火狐浏览器
                    fileName = new String(fileName.getBytes(), "UTF8");
                } else {
                    fileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
                }
                response.setHeader("Content-disposition", "attachment; filename=" + fileName);
            } catch (UnsupportedEncodingException e) {
                return false;
            }
            InputStream in = null;
            OutputStream out = null;
            try {
                //获取要下载的文件输入流
                in = new FileInputStream(filePath);
                int len = 0;
                //创建数据缓冲区
                byte[] buffer = new byte[1024];
                //通过response对象获取outputStream流
                out = response.getOutputStream();
                //将FileInputStream流写入到buffer缓冲区
                while((len = in.read(buffer)) > 0) {
                    out.write(buffer,0,len);
                }
            } catch (Exception e) {
                return false;
            } finally {
                try {
                    if (out != null)
                        out.close();
                    if(in!=null)
                        in.close();
                } catch (IOException e) {
                }
            }
            return true;
        }else {
            return false;
        }
    }

    public JSONArray getFileList(String applyId){
        List<CommFile> commFile = commFileDao.findCommFilesByApplyId(applyId);
        JSONArray array = new JSONArray();
        for (int i = 0; i < commFile.size() ; i++) {
            JSONObject file = new JSONObject();
            file.put("fileId",commFile.get(i).getFileId());
            file.put("name",commFile.get(i).getFileName());
            file.put("url","/file/download?fileId="+commFile.get(i).getFileId());
            array.add(file);
        }
        return array;
    }

    public boolean deleteFile(String fileId) {
        try{
            commFileDao.deleteById(fileId);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
