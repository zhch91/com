package com.fis.feeitem.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.fis.feeitem.dao.IFisFeeItemDao;
import com.fis.feeitem.data.FisFeeItem;
import com.fis.feeitem.data.ParamsCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class FisFeeItemEditService {
    @Autowired
    private IFisFeeItemDao fisFeeItemDao;

    public JSONObject saveFeeItem(ParamsCollection paramsCollection){
        JSONObject jsonObject = new JSONObject();
        String feeItem = (String) paramsCollection.getParameter("feeItem");
        FisFeeItem fisFeeItem = JSON.parseObject(feeItem, new TypeReference<FisFeeItem>(){});
        try{
            fisFeeItemDao.save(fisFeeItem);
            jsonObject.put("code","success");
            jsonObject.put("message","保存成功");
        }catch (Exception e){
            jsonObject.put("code","fail");
            jsonObject.put("message",e.getMessage());
        }
        return jsonObject;
    }

    public void deleteFeeItem(ParamsCollection paramsCollection) {
        String itemId = (String) paramsCollection.getParameter("itemId");
        fisFeeItemDao.deleteById(itemId);
    }
}
