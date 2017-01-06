require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/order_details.scss');
var Vue = require('../../../public/lib/vue.js');
var tool = require('../../../public/component/toollib.js');
var text = require('../view/order_details.html');
var $state = require('../../../public/component/$state.js');
var OrderDetailsService = require('./order_details_service.js');

module.exports={
    init:function($el){

        this.$el = $el || $(document.body);
        $('.order-details').remove();
        this.service = new OrderDetailsService(this);
        this.userInfo = tool.getUserInfo();
        this.params = $state.getParams();
        this.render();
        this.$scope = {
            states: {
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
                }
            },
            data: {}
        }; 
        this.service.fetchOrderDetail({
            token: this.userInfo.token,
            orderNo: this.params.orderNo
        });
        this.initVue();
    },
    render:function(){
        this.$el.html(text);
    },
    initVue:function(){ 
        var self = this;
        this.vue = new Vue({
            el: ".order-details",
            data: this.$scope,
            methods: {
                onBack:function(){ self.onBack() },
                deliverGoods: function() { self.deliverGoods() },
                confirmConsume: function() { self.confirmConsume() }
            }
        });
    },
    onBack:function(){
        tool.back();
    },
    deliverGoods: function() {
        this.service.sendGoodsOrder({
            token: this.userInfo.token,
            appId: "pxsj",
            deliveryCode: "pxjs",
            deliveryComId: "123",
            orderNo: this.params.orderNo
        });
    },
    confirmConsume: function() {
        this.service.consumeOrder({
            token: this.userInfo.token,
            consumeCode: this.params.consumeCode,
            orderNo: this.params.orderNo,
            appId: "xxx"
        });
    },
    fetchOrderDetailCallback: function(result) {
        var self = this;
        if(result.status) {
            if(result.data.nextNodeCode) {
                result.data.nextNodeCodeName = this.$scope.states.orderStatus[result.data.nextNodeCode];
            } else {
                result.data.nextNodeCodeName = "";
            }
            result.data.sumMoney = 0;
            $.each(result.data.goods, function(index, item) {
                result.data.sumMoney += parseFloat(item.num) * parseFloat(item.price);
                if(!item.currentRefundNodeCode) {
                    item.currentRefundNodeCodeName = result.data.nextNodeCodeName;
                } else {
                    item.currentRefundNodeCodeName = self.$scope.states.waresStatus[item.currentRefundNodeCode];
                }
            });
            if(result.data.sumMoney > 0) {
                result.data.sumMoney = result.data.sumMoney.toFixed(2);
            }
            

            for(var o in result.data.address) {
                if(!result.data.address[o]) {
                    result.data['_'+o] = "";
                } else {
                    result.data['_'+o] = result.data.address[o];
                }
            }

            if(this.params.isShowButton) {
                result.data.isShowButton = true;
            } else {
                result.data.isShowButton = false;
            }
            
            this.$scope.data = result.data;
        } else {
            tool.alert(result.msg);
        }
    },
    refreshOrderDetailsCallback: function(result) {
        if(result.status) {
            this.service.fetchOrderDetail({
                token: this.userInfo.token,
                orderNo: this.params.orderNo
            });
        } else {
            tool.alert(result.msg);
        }
    }
}