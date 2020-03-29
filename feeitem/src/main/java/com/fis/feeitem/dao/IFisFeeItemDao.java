package com.fis.feeitem.dao;

import com.fis.feeitem.data.FisFeeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IFisFeeItemDao extends JpaRepository<FisFeeItem, String>, JpaSpecificationExecutor<FisFeeItem> {

}
