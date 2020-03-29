package com.security.base.dao;

import com.security.base.data.CommUserMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ICommUserMenuDao extends JpaRepository<CommUserMenu, Long> {

}
