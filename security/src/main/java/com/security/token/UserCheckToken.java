package com.security.token;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

public class UserCheckToken {

    @NotEmpty(message = "用户名不能为空")
    private String userId;

    @NotEmpty(message = "密码不能为空")
    @Size(min=1,max=10,message = "密码长度必须1到10位")
    private String userPass;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserPass() {
        return userPass;
    }

    public void setUserPass(String userPass) {
        this.userPass = userPass;
    }
}
