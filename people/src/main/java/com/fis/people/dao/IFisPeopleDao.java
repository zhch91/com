package com.fis.people.dao;

import com.fis.people.data.FisPeopleInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IFisPeopleDao extends JpaRepository<FisPeopleInfo, Long>, JpaSpecificationExecutor<FisPeopleInfo> {

}
