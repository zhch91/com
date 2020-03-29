package com.security.base.dao;

import com.security.base.data.CommMenu;
import com.security.base.data.CommUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ICommMenuDao extends JpaRepository<CommUser, Long> {

    public List<CommMenu> getMenuDataByUserId(String userId);

}
