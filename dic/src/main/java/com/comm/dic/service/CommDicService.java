package com.comm.dic.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.comm.dic.dao.ICommDicDao;
import com.comm.dic.data.CommDic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CommDicService {

    @Autowired
    private ICommDicDao commDicDao;

    public String batchGetDices(JSONArray dices){
        JSONObject reDices = new JSONObject();
        for(int i=0;i<dices.size();i++){
            JSONObject dicQ = dices.getJSONObject(i);
            if("commDic".equals(dicQ.getString("tableName"))){
                List<CommDic> dicList = commDicDao.findByTypeAndInUseOrderBySeq(dicQ.getString("type"),dicQ.getString("inUse"));
                reDices.put(dicQ.getString("id"),dicList);
            }
        }
        return reDices.toJSONString();
    }
}
