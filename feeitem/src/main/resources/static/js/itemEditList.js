let typeDic;
const dices = [{id:"typeDic","tableName":"commDic","type":"item","inUse":"1"}];
let dicCmd = new Fis.Cmd("/dic/jsBatch");
dicCmd.setParameter("dices",dices);
dicCmd.successFunc(dealData);
dicCmd.execute(true);

$(function(){
    let condition = new Vue({
        el: "#searchDiv",
        data: {
            search: '',
            itemName:'',
            itemType:'',
            itemFeeMax:'',
            itemFeeMin:'',
            dices:{
                typeDic: typeDic
            }
        }
        ,
        methods: {
            doSearch() {
                table.getData(this.PageSize, this.currentPage);
            },
        }
    });
    let table = new Vue({
        el:"#peopleTable",
        data:{
            tableData:[],
            currentPage:1,
            // 总条数，根据接口获取数据长度(注意：这里不能为空)
            totalCount:1,
            // 个数选择器（可修改）
            pageSizes:[10,25,50,100],
            // 默认每页显示的条数（可修改）
            PageSize:10,
            loading:true
        },
        methods:{
            // 将页码，及每页显示的条数以参数传递提交给后台
            getData(n1,n2) {
                // 这里使用axios，使用时请提前引入
                _this = this;
                $.ajax({
                    url:"/fis/feeItem/query/list",
                    data:JSON.stringify({
                        params:{
                            "search":condition.search,
                            "itemName":condition.itemName,
                            "itemType":condition.itemType,
                            "itemFeeMax":condition.itemFeeMax,
                            "itemFeeMin":condition.itemFeeMin
                        },
                        page:{
                            pageNo:n2,
                            pageSize:n1
                        }
                    }),
                    type:'POST',
                    async:true,
                    contentType:"application/json",
                    dataType:"json",
                    success:function(data){
                        _this.tableData = data.content;
                        _this.totalCount=data.totalElements;
                        _this.loading=false;
                    },
                    error:function(xhr, textStatus, errorThrown){

                    }
                });
            },
            // 分页
            // 每页显示的条数
            handleSizeChange(val) {
                // 改变每页显示的条数
                this.PageSize=val
                // 点击每页显示的条数时，显示第一页
                this.getData(val,1)
                // 注意：在改变每页显示的条数时，要将页码显示到第一页
                this.currentPage=1
            },
            // 显示第几页
            handleCurrentChange(val) {
                // 改变默认的页数
                this.currentPage=val
                // 切换页码时，要获取每页显示的条数
                this.getData(this.PageSize,val)
            },
            handleEdit(index,row){
                edit(row.itemId);
            },
            handleDelete(index,row){
                _this = this;
                this.$confirm('正在删除收费项目'+row.itemName, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var delCmd = new Fis.Cmd("/fis/feeItem/edit/delete");
                    delCmd.setParameter("itemId",row.itemId);
                    delCmd.successFunc(function(data){
                        _this.getData(this.PageSize,this.currentPage);
                    });
                    delCmd.execute(true);
                }).catch((error) => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            getItemType(row, column, cellValue, index){
                for(i=0;i<typeDic.length;i++){
                    if(cellValue==typeDic[i].code)
                        return typeDic[i].name;
                }
                return "";
            },
            showDetail(row, column, cellValue, index){
                if(cellValue.cellIndex=="2") {
                    window.location.href = "../detail?peopleId=" + row.itemId;
                }
            }
        },
        created:function(){
            this.getData(this.PageSize,this.currentPage)
        }
    });
    let toolBar = new Vue({
        el:"#toolbar",
        data:{},
        methods:{
            addPeople(){
                window.location.href="../edit";
            }
        }
    });

});

function edit(itemId){
    window.location.href="../edit?itemId="+itemId;
}

function dealData(data){
    typeDic= data.typeDic;
}
