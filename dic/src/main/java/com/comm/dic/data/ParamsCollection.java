package com.comm.dic.data;

import java.util.Map;

public class ParamsCollection {

    private Map<String,Object> params;

    public Map<String, Object> getParams() {
        return params;
    }

    public void setParams(Map<String, Object> params) {
        this.params = params;
    }

    public Object getParameter(String id){
        return this.params.get(id);
    }
}
