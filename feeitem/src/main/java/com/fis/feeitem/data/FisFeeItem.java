package com.fis.feeitem.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@JsonIgnoreProperties(value = { "hibernateLazyInitializer"})
@EntityListeners(AuditingEntityListener.class)
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class FisFeeItem implements Serializable {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    //项目编码
    private String itemId;
    @Column
    //项目名称
    private String itemName;
    @Column
    //项目类型
    private String itemType;
    @Column
    //使用范围
    private String itemScope;
    @Column
    private double itemFee;
    @Column
    private String itemFeeUnit;
    @Column
    @CreatedDate
    private Date createTime;
    @Column
    private String createUser;
    @Column
    @LastModifiedDate
    private Date updateTime;
    @Column
    private String updateUser;

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public String getItemScope() {
        return itemScope;
    }

    public void setItemScope(String itemScope) {
        this.itemScope = itemScope;
    }

    public double getItemFee() {
        return itemFee;
    }

    public void setItemFee(double itemFee) {
        this.itemFee = itemFee;
    }

    public String getItemFeeUnit() {
        return itemFeeUnit;
    }

    public void setItemFeeUnit(String itemFeeUnit) {
        this.itemFeeUnit = itemFeeUnit;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }
}
