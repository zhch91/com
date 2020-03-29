package com.security.base.dao;

import com.security.base.data.CommUser;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ICommUserDao extends JpaRepository<CommUser, String> {

    CommUser findByUserIdAndUserPass(String userId, String userPass);
}
