require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/power.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/subpage/power.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var PowerService = require("../js/powerService.js");

module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.service = new PowerService(this);
        this.params = $state.getParams();
        this.render();
        this.initVue();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
    },
    initVue: function () {
        this.$scope = {
            res: {},
            states: {
                list_index: "",
            },
            backdata: [],
            ishide: false

        };
        var self = this;
        this.vue = new Vue({
            el: '.subpage_power',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                Onlist: function (index) {
                    self.Onlist(index);
                },
                Onadd_news: function () {
                    self.Onadd_news()
                }
            },
            ready: function () {

                //   self.$scope.backdata.length = 0;
                self.ObtainPermis();
            },
        })
    },
    goBack: function () {
        var params = $state.getItem(this.params.hash);
        params.params.isRefresh = false;
        tool.back();
    },
    //组织好数据给父页面发送数据（选择的权限）
    Onlist: function (index) {
  
        if (this.$scope.res[index].class == "block") {
            this.$scope.res[index].class = "none";
        } else {
            this.$scope.res[index].class = "block";
        };
        index = "";
    },
    //发送需要获取权限的参数
    ObtainPermis: function () {
        var UserInfo = tool.getUserInfo();
        if (UserInfo.shopId) {
            var set_obj = {
                shopId: UserInfo.shopId
            }
            this.service.SetPermis(set_obj)
        } else {
            tool.alert("skksksksk")
        }

    },
    //获取权限数据
    GetPermisData: function (params) {
        console.log(params);
        if (params.status && params.data) {
            for (var i = 0; i < params.data.length; i++) {
                params.data[i].class = "none"
            }
            this.$scope.res = params.data;
        } else {
            tool.alert("没有数据")
        }
    },
    //点击确定给父页面将数据发送过去
    Onadd_news: function () {
        var myscope = this.$scope.states;
        for (var i = 0; i < this.$scope.res.length; i++) {
            if (this.$scope.res[i].class == "block") {
                var backobj = {
                    moduleid: "",
                    moduleName: ""
                }
                backobj.moduleid = this.$scope.res[i].shopModuleId;
                backobj.moduleName = this.$scope.res[i].moduleName;
                this.$scope.backdata.push(backobj);
            } else {

            }
        };
        console.log(this.$scope.backdata)

        // console.log(list)
        // this.$scope.backdata=list;
        if (this.$scope.backdata.length > 0) {
            var params = $state.getItem(this.params.hash);
            params.params.isRefresh = false;
            $state.emit("backdata", this.$scope.backdata);
            this.$scope.backdata = [];
            tool.back();
        }else{
            tool.alert("您没有添加权限")
        }

    },

}