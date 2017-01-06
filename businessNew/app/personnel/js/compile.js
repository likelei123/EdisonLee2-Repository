require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/compile.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/subpage/compile.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var CompileService = require("../js/compileService.js")


module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.service = new CompileService(this)
        this.render();
        this.initVue();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            checkColor: false,
            index: "-1",
            res: {},
            empids: [],
        };
        this.vue = new Vue({
            el: '.subpage_compile',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                check: function (event, index) {
                    self.check(event, index)
                },
                Goparticulars: function () {
                    self.Goparticulars();
                },
                set: function (params) {
                    self.set()
                }
            },
            ready: function () {
                self.SetStaffdata();
            }
        })
    },
    goBack: function () {
        tool.back();
    },
    check: function (event, index) {
        $(event.target).addClass("check")
        this.$scope.index = index;
        //   this.$scope.res.data[index].empId
        this.$scope.empids.push(index);
        index = "";
        this.$scope.checkColor = true;
    },
    Goparticulars: function () {
        tool.go("#/particulars")
    },
    //发送获取员工墙数据的参数
    SetStaffdata: function () {
        var UserInfo = tool.getUserInfo();
        var Staffobj = {
            shopId: UserInfo.shopId,
            token: UserInfo.token,
            status: "3"
        };
        this.service.SetStaffInfo(Staffobj)
    },
    BackStaffDate: function (backdata) {
        console.log(backdata)
        if (backdata.status) {
            this.$scope.res = backdata;
            console.log(this.$scope.res)
        }
    },
    set: function () {
        console.log();
        this.SetStaffIsShowData();
            // console.log(this.$scope.empids)
    },
    //发送员工显示的参数
    SetStaffIsShowData: function () {
        var UserInfo = tool.getUserInfo();
        var empid = this.$scope.empids.join();
        console.log(empid.trim())
        var Staffobj = {
            token: UserInfo.token,
            shopId: UserInfo.shopId,
            empIds: empid
        };
        if(UserInfo.token){
             this.service.SetstaffIsShowinfo(Staffobj)
        }else{
            tool.alert("没有此店铺，或此用户登录过期")
        }
    },
    //获取员工是否显示员工墙的成功与否
    BackStaffIsShow:function (databack) {
        console.log(databack);
        if(databack.status){
               tool.alert("操作成功")
            setTimeout(function () {
                 tool.back();
            },1000)
           
        }else{
            tool.alert(databack.msg)
        }
    }

}