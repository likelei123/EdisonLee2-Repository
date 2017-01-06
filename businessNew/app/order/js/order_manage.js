require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/order_manage.scss');
var Vue = require('../../../public/lib/vue.js');
var tool = require('../../../public/component/toollib.js');
var $state = require('../../../public/component/$state.js');
var text = require('../view/order_manage.html');
var itemText = require('../view/order_item.html');

var OrderMangeService = require('./order_manage_service.js');
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.service = new OrderMangeService(this);
        this.userInfo = tool.getUserInfo();
        this.render();
        this.$scope = {
            //states自己的状态数据 
        states:{
            tabIndex:"0",
            state:"0",
            isblock: 'none',
            orderStatus: {
                CREATE: "生成订单",
                PAY: "待支付",
                SEND: "待发货",
                RESERVE: "待收货",
                CONSUME: "待消费",
                CLOUSE: "已关闭",
                END: "已完成"
            },
            waresStatus: {
                REFUND_CREATE: "退款中",
                REFUND_SUCCESS: "退款成功",
                REFUND_FAILED: "退款失败",
                REFUND_CLOSE: "退款关闭",
                PLATFORM_IN: "平台介入"
            },
            statusType: "",
            classType: "",
            sortTime: "",
            searchText: ""
        },
        items: []
    };

        this.initVue();
        this.service.fetchOrderList({
            size: 1000,
            index: 1,
            shopId: this.userInfo.shopId,
            token: this.userInfo.token
        });
    },
    render: function () {
        var el = $(text);
        el.find('.order_list').append(itemText);
        this.$el.html(el);
    },
    initVue: function () {
        var self = this;
        this.vue = new Vue({
            el: '.order-box',
            data: this.$scope,
            methods: {
                onBack: function () { self.onBack() },
                onGodetails: function (item) { self.onGodetails(item) },
                onLi: function (index, event) { self.onLi(index, event) },
                onSelectStatus: function(param, event) { self.onSelectStatus(param, event) },
                queryOrderList: function() { self.queryOrderList() }
            }
        });
    },
    onBack: function () {
        $state.emit('create', {
            name: 'lili',
            age: 18
        });
        tool.back();
    },
    onGodetails: function (item) {
        tool.go("#order/order_details", item)
    },
    //导航条操作的效果
    onLi: function (index, event) {
        if (this.$scope.states.state == index) {
            this.$scope.states.state = 0;
            this.$scope.states.tabIndex = 0;
            if (this.$scope.states.tabIndex == 0) {
                this.$scope.states.isblock = 'none';
            } else {
                this.$scope.states.isblock = 'block';
            }
        } else {
            this.$scope.states.state = index;
            this.$scope.states.tabIndex = index;
            if (this.$scope.states.tabIndex == 0) {
                this.$scope.states.isblock = 'none';
            } else {
                this.$scope.states.isblock = 'block';
            }
        };
    },
    onSelectStatus: function (type, event) {
        var code = $(event.target).attr('code');
        var s = this.$scope.states;
        s.state = 0;
        s.isblock = 'none';
        s[type] = code;

        var queryStr = {
            size: 999,
            index: 1,
            shopId: this.userInfo.shopId,
            token: this.userInfo.token,
        };
        if(s.statusType != "" && s.statusType != "ALL") {
            queryStr.nextNodeCode = s.statusType;
        }
        if(s.sortTime != "") {
            queryStr.orderBy = s.sortTime;
        }
        if(s.classType != "" && s.classType != "ALL") {
            queryStr.orderType = s.classType;
        }
        this.service.fetchOrderList(queryStr);
    },
    queryOrderList: function() {
        var queryStr = {
            size: 999,
            index: 1,
            shopId: this.userInfo.shopId,
            token: this.userInfo.token,
        };
        var s = this.$scope.states;
        if(s.statusType != "" && s.statusType != "ALL") {
            queryStr.nextNodeCode = s.statusType;
        }
        if(s.sortTime != "") {
            queryStr.orderBy = s.sortTime;
        }
        if(s.classType != "" && s.classType != "ALL") {
            queryStr.orderType = s.classType;
        }
        if(s.searchText != "") {
            queryStr.orderNo = s.searchText;
        }
        this.service.fetchOrderList(queryStr);
    },
    fetchOrderListCallback: function(result) {
        var self = this;
        if(result.status) {
            self.$scope.items.splice(0, 9999);
            $.each(result.data, function(index, item) {
                item.nextNodeCodeName = self.$scope.states.orderStatus[item.nextNodeCode];
                item.sumProduct = 0;
                item.sumPrice = 0;
                $.each(item.goods, function(index, itm) {
                    item.sumProduct += parseInt(itm.num);
                    item.sumPrice += (parseFloat(itm.price)*parseFloat(itm.num)*1.00);

                    if(itm.currentRefundNodeCode) {
                        itm.currentRefundNodeCodeName = self.$scope.states.waresStatus[itm.currentRefundNodeCode];
                    } else {
                        itm.currentRefundNodeCodeName = "";
                    }
                });
                item.sumPrice = new Number(item.sumPrice).toFixed(2);
                item.deliveryFee = new Number(item.deliveryFee).toFixed(2);
                self.$scope.items.push(item);
            });  
        } else {
            tool.alert(result.msg);
        }
        
    }
}