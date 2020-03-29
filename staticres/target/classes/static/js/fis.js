let Fis = {};
Fis.Cmd = function(url){
    this.url = url;
    this.data = {
        params:{}
    };
    this.error = undefined;
    this.returns = undefined;
    this.handleSuccess = undefined;
}
Fis.Cmd.prototype = {
    setParameter : function(id,value){
        this.data.params[id]=value;
    },
    successFunc:function(func){
        this.handleSuccess = func;
    },
    execute : function(flag){
        $.ajax({
            url:this.url,
            data:JSON.stringify(this.data),
            type:'POST',
            async:!flag,
            contentType:"application/json",
            dataType:"json",
            success:this.handleSuccess,
            error:function(xhr, textStatus, errorThrown){
                this.error = {
                    status:xhr.status,
                    message:xhr.statusText,
                    detail:xhr.responseText
                }
            }
        });
    },
    getReturns:function(){
        return this.returns;
    }
}


function getRowNumber(value, row, index){
    return index + 1;
}



