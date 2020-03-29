package com.security.base.service;

import com.security.base.data.CommMenu;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CommMenuService {

    @PersistenceContext
    EntityManager entityManager;

    public List<CommMenu> findMenusByUserIdAndParent(String userId,String parentMenuId) {
        StringBuilder selectSql = new StringBuilder();
        selectSql.append("select m.* ");
        selectSql.append(" from comm_user_menu u join comm_menu m on u.menu_id = m.menu_id");
        Map<String,Object> params = new HashMap<>();
        StringBuilder whereSql = new StringBuilder(" where 1=1 ");
        if(StringUtils.isNotBlank(userId)){
            whereSql.append("and u.user_Id = :userId ");
            params.put("userId",userId);
        }
        if(StringUtils.isNotBlank(parentMenuId)){
            whereSql.append("and m.parent_menu_id = :parentMenuId ");
            params.put("parentMenuId",parentMenuId);
        }
        StringBuilder orderSql = new StringBuilder();
        orderSql.append(" order by menu_level,seq");
        String querySql = new StringBuilder().append(selectSql).append(whereSql).append(orderSql).toString();
        List<CommMenu> menuList = new ArrayList<CommMenu>();
        try{
            Query query = this.entityManager.createNativeQuery(querySql,CommMenu.class);
            this.setParameters(query,params);
            menuList = query.getResultList();
        }catch (Exception e){
            e.printStackTrace();
        }
        return menuList;
    }
    private void setParameters(Query query,Map<String,Object> params){
        for(Map.Entry<String,Object> entry:params.entrySet()){
            query.setParameter(entry.getKey(),entry.getValue());
        }
    }

}
