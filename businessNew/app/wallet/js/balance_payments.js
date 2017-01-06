require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/balance_payments.scss');
var tool = require('../../../public/component/toollib.js');
var Vue = require('../../../public/lib/vue.js');
var text = require('../view/balance_payments.html');

module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();
        this.ininVue();
    },
    render: function () {
        this.$el.html(text)
    },
    ininVue: function () {
        this.$scope = {
            states: {
                show_hide: false,
                bind_class: true,
               small_list:['全部','收入','支出'],
               title:"全部",
               list_index:"0",
               details_show:false
            }
        };
        var self = this;
        this.vue = new Vue({
            el: ".balance-payments",
            data: this.$scope,
            methods: {
                Titleclick: function () { self.Titleclick() },
                hide_small: function () { self.hide_small() },
                obtainTetx:function (index) { self.obtainTetx(index) },
                Goback:function () {self.Goback() },
                OnShowDetails:function (index) {self.OnShowDetails(index) },
                OnSecHide:function () {self.OnSecHide() }
            }
        })
    },
    //点击全部小分类弹框的隐藏和显示
    Titleclick: function () {
        var scope = this.$scope;
        if (scope.states.show_hide == true) {
            scope.states.show_hide = false;
            scope.states.bind_class = true;
        } else {
            scope.states.show_hide = true;
            scope.states.bind_class = false;
        }
    },
  //点击黑色的地方隐藏小分类弹框
    hide_small: function () {
        var scope = this.$scope;
        scope.states.show_hide = false;
        scope.states.bind_class = true;
    },
    //点击小分类的操作
    obtainTetx:function (index) {
        var scope = this.$scope;
        scope.states.list_index=index;
        scope.states.title=scope.states.small_list[index];

    },
    //点击订单显示详情
    OnShowDetails:function (index) {
             var scope = this.$scope;
         scope.states.details_show=true;
    },
    //点击黑色处隐藏
    OnSecHide:function () {
            var scope = this.$scope;
         scope.states.details_show=false;
    },
    Goback:function () {
     tool.back();
    }
}