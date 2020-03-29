package com.fis.people.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.fis.people.dao.IFisPeopleDao;
import com.fis.people.data.FisPeopleInfo;
import com.fis.people.data.ParamsCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class FisPeopleInfoEditService {
    @Autowired
    private IFisPeopleDao fisPeopleDao;

    public JSONObject savePeople(ParamsCollection paramsCollection){
        JSONObject jsonObject = new JSONObject();
        String people = (String) paramsCollection.getParameter("people");
        FisPeopleInfo fisPeopleInfo = JSON.parseObject(people, new TypeReference<FisPeopleInfo>(){});
        try{
            fisPeopleDao.save(fisPeopleInfo);
            jsonObject.put("code","success");
            jsonObject.put("message","保存成功");
        }catch (Exception e){
            jsonObject.put("code","fail");
            jsonObject.put("message",e.getMessage());
        }
       return jsonObject;
    }

    public void deletePeople(ParamsCollection paramsCollection) {
        int peopleId = (int) paramsCollection.getParameter("peopleId");
        fisPeopleDao.deleteById(Long.valueOf(peopleId));
    }
}
