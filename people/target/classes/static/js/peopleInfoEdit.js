let peopleDs;
let toolBar;
$(function(){
    let peopleId = $("#peopleId").val();
    let cmd;
    if(peopleId!=""){
        cmd = new Fis.Cmd("/fis/people/query/one");
        cmd.setParameter("peopleId",peopleId);
        cmd.successFunc(dealVue);
        cmd.execute(true);
    }else{
        cmd = new Fis.Cmd("/fis/people/query/getNewJson");
        cmd.successFunc(dealVue);
        cmd.execute(true);
    }
    toolBar = new Vue({
        el: '#toolBar',
        data: {},
        methods: {
            formSubmit: function () {
                peopleDs.submit();
            },
            returnBack: function(){
                history.back();
            }
        }
    });
});


function dealReturn(data){
    if(data.code=="success"){
        peopleDs.$message({
            type:'success',
            message:"保存成功",
            showClose:true,
            duration:2000,
            onClose:function(){
                toolBar.returnBack();
            }
        });
    }else{
        peopleDs.$message({
            type:'error',
            message:"保存失败"+data.message,
            showClose:true,
            duration:2000
        });
    }
}

function savePeople(data){
    let cmd = new Fis.Cmd("/fis/people/edit/save");
    cmd.setParameter("people",data);
    cmd.successFunc(dealReturn);
    cmd.execute(true);
}

function dealVue(data){
    if(data.people.head==null){
        data.people.head="../static/images/camera.png"
    }
    peopleDs = new Vue({
        el: '#peopleForm',
        data:function(){
            return{
                people:data.people,
                dices:data.dices,
                errorStr:"",
                rules: {
                    workNo: [
                        { required: true, message: '请输入工号', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    peopleName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                    ],
                    idCard: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' },
                        { min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'blur' }
                    ]
                }
            }
        },methods: {
            submit: function(event) {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        let formData = JSON.stringify(this.people);
                        savePeople(formData);
                    }
                });
            },
            formSubmit:function(){
                alert(123);
            },
            onchangeImgFun (e) {
                var file = e.target.files[0]
                let imgSize = file.size
                var _this = this // this指向问题，所以在外面先定义
                if (imgSize <= 2 * 1024 * 1024) {
                    _this.errorStr = ''
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var dataURL = reader.result
                        _this.people.head = dataURL
                    }
                    reader.readAsDataURL(file) // 读出 base64
                } else {
                    _this.errorStr = '图片大小超出范围';
                }
            }
        }
    });
}