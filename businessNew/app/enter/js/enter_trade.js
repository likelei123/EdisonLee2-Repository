require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/enter_trade.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state");
var text = require("../view/enter_trade.html");
var EnterTradeService = require('./enter_trade_service.js');
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.params = $state.getParams();
        this.service = new EnterTradeService(this);
        this.render();
        this.ininVue();
        this.initData();
    },
    render: function () {
        this.$el.html(text)
    },
    ininVue: function () {
        var self = this;
        this.$scope = {
            states: {},
            data: {
                headerTitle : this.params.type,
                items: []
            }
        };
        this.vue = new Vue({
            el: ".enter-trade-box",
            data: this.$scope,
            methods: {
                onGoback: function() { self.onGoback() },
                selectCatType: function (param) { self.selectCatType(param) }
            }
        })
    },
    initData: function () { 
        if(this.params.status == 1) {
            this.service.fetchCatList({});
        } else if (this.params.status == 2) {
            this.service.fetchCatList({
                categoryCode: this.params.catId
            });
        }
     },
    onGoback: function() {
        tool.back();
    },
    selectCatType: function (item) { 
        var ops = {
            level: this.params.status,
            catId: item.categoryCode,
            catName: item.categoryName
        };
        var key = this.params.windowHash;
        var params = $state.getItem(key);
        params.params.isRefresh = false;
        $state.emit('enterSelectTradeCallback', ops);
        tool.back();
    },
    fetchCatListCallback: function (result) { 
        console.log(result);
        if(result.status) {
            if(result.data) {
                this.$scope.data.items = result.data;
            } else {
                tool.alert("后台返回行业数据是空的！");
            }
        } else {
            tool.alert(result.msg);
        }
    }
}