package com.fis.people.service;

import com.fis.people.dao.IFisPeopleDao;
import com.fis.people.data.FisPeopleInfo;
import com.fis.people.data.ParamsCollection;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import javax.transaction.Transactional;
import java.util.*;

@Service
@Transactional
public class FisPeopleInfoQueryService {
    @Autowired
    private IFisPeopleDao fisPeopleDao;
    @PersistenceContext
    EntityManager entityManager;

    public FisPeopleInfo queryPeopleOne(ParamsCollection pc){
        String peopleId = (String) pc.getParameter("peopleId");
        FisPeopleInfo fisPeopleInfo = fisPeopleDao.getOne(Long.valueOf(peopleId));
        return fisPeopleInfo;
    }

    public Page<FisPeopleInfo> queryPeople(ParamsCollection pc){
        String search = (String) pc.getParameter("search");
        Pageable pageable;
        if(pc.getPageNo()!=0) {
            pageable = PageRequest.of(pc.getPageNo() - 1, pc.getPageSize());
        }else{
            pageable = Pageable.unpaged();
        }
        Page<FisPeopleInfo> page = fisPeopleDao.findAll(getWhereClause(pc), pageable);
        return page;
    }

    private Specification<FisPeopleInfo> getWhereClause(ParamsCollection pc){
        return new Specification<FisPeopleInfo>() {
            @Override
            public Predicate toPredicate(Root<FisPeopleInfo> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                Predicate predicate = cb.conjunction();//动态SQL表达式
                List<Expression<Boolean>> exList = predicate.getExpressions();//动态SQL表达式集合
                List<Predicate> list = new ArrayList<Predicate>();
                return getPredicate(root, query, cb, list, pc);
            }
        };
    }

    private Predicate getPredicate(Root<FisPeopleInfo> root, CriteriaQuery<?> query, CriteriaBuilder cb, List<Predicate> list, ParamsCollection pc) {
        String search = (String) pc.getParameter("search");
        if(search!=null&&StringUtils.isNotEmpty("search")){
            list.add(cb.like(root.get("peopleName"), "%" + search + "%"));
            list.add(cb.like(root.get("idCard"), "%" + search + "%"));
            list.add(cb.like(root.get("className"), "%" + search + "%"));
            list.add(cb.like(root.get("telPhone"), "%" + search + "%"));
            Predicate[] arrayOr = new Predicate[list.size()];
            Predicate Pre_Or = cb.or(list.toArray(arrayOr));
            query.where(Pre_Or);
        }
        return query.getRestriction();
    }
}
