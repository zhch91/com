package com.comm.dic.data;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@IdClass(CommDicKey.class)
public class CommDic  implements Serializable {

    @Id
    private int code;
    @Column
    private String name;
    @Column
    private String inUse;
    @Id
    private String type;
    @Column
    private int seq;

    public String getCode() {
        return String.valueOf(code);
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInUse() {
        return inUse;
    }

    public void setInUse(String inUse) {
        this.inUse = inUse;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }
}
