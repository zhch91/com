package com.fis.feeitem.service;

import com.fis.feeitem.dao.IFisFeeItemDao;
import com.fis.feeitem.data.FisFeeItem;
import com.fis.feeitem.data.ParamsCollection;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class FisFeeItemQueryService {

    @Autowired
    private IFisFeeItemDao fisFeeItemDao;
    @PersistenceContext
    EntityManager entityManager;

    public FisFeeItem queryFeeItemOne(ParamsCollection pc){
        String itemId = (String) pc.getParameter("itemId");
        FisFeeItem fisFeeItem = fisFeeItemDao.getOne(itemId);
        return fisFeeItem;
    }

    public Page<FisFeeItem> queryFeeItem(ParamsCollection pc){
        String search = (String) pc.getParameter("search");
        Pageable pageable;
        if(pc.getPageNo()!=0) {
            pageable = PageRequest.of(pc.getPageNo() - 1, pc.getPageSize());
        }else{
            pageable = Pageable.unpaged();
        }
        Page<FisFeeItem> page = fisFeeItemDao.findAll(getWhereClause(pc), pageable);
        return page;
    }

    private Specification<FisFeeItem> getWhereClause(ParamsCollection pc){
        return new Specification<FisFeeItem>() {
            @Override
            public Predicate toPredicate(Root<FisFeeItem> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Predicate predicate = cb.conjunction();//动态SQL表达式
                List<Expression<Boolean>> exList = predicate.getExpressions();//动态SQL表达式集合
                List<Predicate> list = new ArrayList<Predicate>();
                return getPredicate(root, query, cb, list, pc);
            }
        };
    }

    private Predicate getPredicate(Root<FisFeeItem> root, CriteriaQuery<?> query, CriteriaBuilder cb, List<Predicate> list, ParamsCollection pc) {
        String search = (String) pc.getParameter("search");
        if(search!=null&& StringUtils.isNotEmpty("search")){
            list.add(cb.like(root.get("itemName"), "%" + search + "%"));
            list.add(cb.like(root.get("itemFeeUnit"), "%" + search + "%"));
            list.add(cb.like(root.get("itemScope"), "%" + search + "%"));
            Predicate[] arrayOr = new Predicate[list.size()];
            Predicate Pre_Or = cb.or(list.toArray(arrayOr));
            query.where(Pre_Or);
        }
        return query.getRestriction();
    }
}
