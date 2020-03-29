package com.fis.people.data;

import java.util.Map;

public class ParamsCollection {

    private Map<String,Object> params;

    private PageInfo page;

    public Map<String, Object> getParams() {
        return params;
    }

    public void setParams(Map<String, Object> params) {
        this.params = params;
    }

    public Object getParameter(String id){
        return this.params.get(id);
    }

    public PageInfo getPage() {
        return page;
    }

    public void setPage(PageInfo page) {
        this.page = page;
    }

    public int getPageNo(){
        return this.getPage().getPageNo();
    }

    public int getPageSize(){
        return this.getPage().getPageSize();
    }
}
