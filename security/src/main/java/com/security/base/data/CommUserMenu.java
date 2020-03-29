package com.security.base.data;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class CommUserMenu implements Serializable {
    @Id
    private String userId;
    @Column
    private String menuId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMenuId() {
        return menuId;
    }

    public void setMenuId(String menuId) {
        this.menuId = menuId;
    }
}
