let itemDs;
let toolBar;
$(function(){
    let itemId = $("#itemId").val();
    let cmd;
    if(itemId!=""){
        cmd = new Fis.Cmd("/fis/feeItem/query/one");
        cmd.setParameter("itemId",itemId);
        cmd.successFunc(dealVue);
        cmd.execute(true);
    }else{
        cmd = new Fis.Cmd("/fis/feeItem/query/getNewJson");
        cmd.successFunc(dealVue);
        cmd.execute(true);
    }
    toolBar = new Vue({
        el: '#toolBar',
        data: {},
        methods: {
            formSubmit: function () {
                itemDs.submit();
            },
            returnBack: function(){
                history.back();
            }
        }
    });
});


function dealReturn(data){
    if(data.code=="success"){
        itemDs.$message({
            type:'success',
            message:"保存成功",
            showClose:true,
            duration:2000,
            onClose:function(){
                toolBar.returnBack();
            }
        });
    }else{
        itemDs.$message({
            type:'error',
            message:"保存失败"+data.message,
            showClose:true,
            duration:2000
        });
    }
}

function saveItem(data){
    let cmd = new Fis.Cmd("/fis/feeItem/edit/save");
    cmd.setParameter("feeItem",data);
    cmd.successFunc(dealReturn);
    cmd.execute(true);
}

function dealVue(data){
   itemDs = new Vue({
        el: '#tabs',
        data:function(){
            return{
                item:data.items,
                dices:data.dices,
                fileList:data.fileList,
                uploadData:{
                    applyId:$("#itemId").val()
                },
                activeName:"first",
                dialogImageUrl: '',
                dialogVisible: false,
                imageCount:5,
                errorStr:"",
                rules: {
                    itemName: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    itemType: [
                        { required: true, message: '请选择项目类型', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    itemScope: [
                        { required: true, message: '请选择使用范围', trigger: 'blur' },
                    ],
                    itemFee: [
                        { required: true, message: '请填写项目定价', trigger: 'blur' },
                        { type: 'number', message: '项目定价必须为数字值'}
                    ]
                }
            }
        },methods: {
            submit: function(event) {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let formData = JSON.stringify(this.item);
                        saveItem(formData);
                    }
                });
            },
            handleClick(){

            },
            handleRemove(file, fileList) {
                let cmd = new Fis.Cmd("/file/delete?fileId="+file.fileId);
                cmd.successFunc(function(data){
                    if(data.code=="success"){
                        itemDs.$message({
                            type:data.code,
                            message:data.message,
                            showClose:true,
                            duration:2000
                        });
                    }
                });
                cmd.execute(true);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleExceed(){
                itemDs.$message({
                    type:'error',
                    message:"最多上传"+this.imageCount+"张图片",
                    showClose:true,
                    duration:2000
                });
           }
        }
    });
}