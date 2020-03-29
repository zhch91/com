let portal = new Vue({
    el:"#main",
    data:{
        menus:[],
        isCollapse:true,
        menuWidth:"65px",
        currentUrl:""
    },
    methods:{
        getMenuData(){
            var cmd = new Fis.Cmd("/portal/menus/getMenus");
            cmd.setParameter("userId",userId);
            cmd.successFunc(this.buildMenu)
            cmd.execute();
        },
        buildMenu(menuData){
            _this = this;
            if(menuData.code==="error"){
                this.openVn(menuData.message);
            }else{
                _this.menus = menuData.menus;
            }
        },
        goToMenu(menu){
            this.currentUrl = menu.index;
        },
        changeCollapse(){
          this.isCollapse = !this.isCollapse;
          if(this.isCollapse){
              this.menuWidth="65px";
          }else{
              this.menuWidth="200px";
          }
        },
        openVn(message) {
            const h = this.$createElement;
            this.$message({
                type:"error",
                message: h('p', null, [
                    h('span', null, '菜单权限获取失败,'+message)
                ])
            });
        }
    },
    created:function(){
        this.getMenuData();
    }
});

function getMenuData(){

}

function buildMenu(data){

}

function logout(){
    window.location.href = "http://127.0.0.1:5555/portal";
}