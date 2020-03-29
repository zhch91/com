package com.comm.dic.data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Id;
import java.io.Serializable;

@Embeddable
public class CommDicKey implements Serializable {

    private int code;
    private String type;

    public CommDicKey(){

    }

    public CommDicKey(int code,String type){
        this.code = code;
        this.type = type;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((code == 0) ? 0 : code);
        result = prime * result
                + ((type == null) ? 0 : type.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        CommDicKey other = (CommDicKey) obj;
        if (code == 0) {
            if (other.code != 0)
                return false;
        } else if (code!=other.code)
            return false;
        if (type == null) {
            if (other.type != null)
                return false;
        } else if (!type.equals(other.type))
            return false;
        return true;
    }
}
