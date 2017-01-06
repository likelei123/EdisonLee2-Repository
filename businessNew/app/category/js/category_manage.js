require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/category_manage.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state");
var text = require("../view/category_manage.html");
var CategoryManageService = require('./category_manage_service.js');
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.service = new CategoryManageService(this);
        this.userInfo = tool.getUserInfo();
        this.render();
        this.$scope = {
            states: {
                is_hide: "none",
                add: "",
                add_categor: []
            },
            imtes: {

            },
            touchStratTime: '',
            touchEndTime: ''
        };
        this.initVue();
        this.service.customCategoryListRun({
            token: this.userInfo.token,
            shopId: this.userInfo.shopId
        });
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.vue = new Vue({
            el: ".category-manage",
            data: this.$scope,
            methods: {
                onShow: function () {
                    self.onShow()
                },
                onHide: function () {
                    self.onHide();
                },
                onAddclass: function () {
                    self.onAddclass()
                },
                onBack: function () {
                    self.onBack()
                },
                touchEventStart: function () {
                    self.touchEventStart();
                },
                touchEventEnd: function (index) {
                    self.touchEventEnd(index);
                }
            }
        })
    },
    onShow: function () {
        var myscope = this.$scope.states;
        myscope.is_hide = "block";
    },
    onHide: function () {
        var myscope = this.$scope.states;
        myscope.is_hide = "none";
    },
    onAddclass: function () {
        var myscope = this.$scope.states;
        this.service.addCustomCategoryRun({
            token: this.userInfo.token,
            shopId: this.userInfo.shopId,
            categoryName: myscope.add,
            categoryDesc: myscope.add
        });
        myscope.is_hide = "none";

    },
    onBack: function () {
        tool.back();
    },
    addCustomCategoryCallback: function (result) {
        if (result.status) {
            var myscope = this.$scope.states;
            myscope.add_categor.push({
                id: result.data,
                addname: myscope.add
            });
            myscope.add = "";
        } else {
            tool.alert(result.msg);
        }
    },
    customCategoryListCallback: function (result) {
        var myscope = this.$scope.states;
        if (result.status) {
            $.each(result.data, function (index, item) {
                myscope.add_categor.push({
                    id: item.categoryId,
                    addname: item.categoryName
                });
            });
        } else {
            tool.alert('获取店铺自分类信息失败！');
        }
    },
    touchEventStart: function () {
        var timestamp = Date.parse(new Date());
        this.$scope.touchStratTime = timestamp / 1000;
    },
    touchEventEnd: function (index) {
        var self = this;
        var timestamp = Date.parse(new Date());
        this.$scope.touchEventEnd = timestamp / 1000;
        var startTimeValue = this.$scope.touchStratTime;
        var endTimeValue = this.$scope.touchEventEnd;
        var myscope = this.$scope.states;
        var d_value = endTimeValue - startTimeValue;
        if (d_value > 1) {
            var categoryId = myscope.add_categor[index].id;
            var shopId = self.userInfo.shopId;
            var token = self.userInfo.token;
            this.service.delCategoryListRun(categoryId, shopId, token);
            myscope.add_categor.splice(index, 1);
            tool.alert("删除成功");
        } else {
            tool.go("#/babyManagement",{
                activeIndex:index,
                categoryId: self.$scope.states.add_categor[index].id
            });
        }
    }
    // delCategoryListCallback: function (result) {
    //     if (result.status && result.data) {
    //         tool.alert("删除成功");
    //     }
    // }
}