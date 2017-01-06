require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/refundOperation.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/refundOperation.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

var refundOperationService = require('./refundOperationService.js');
module.exports = {
        init: function ($el) {
            this.$el = $el || $(document.body);
            this.service = new refundOperationService(this);
            this.render();
            this.initVue();
            this.merchandiseNews();
        },
        render: function () {
            var $html = $(text);
            this.$el.html($html);
        },
        initVue: function () {
            var self = this;
            this.$scope = {
                mainShow: 1,
                babyMessage: [], //退款宝贝信息
                userMessage: [], //用户信息
                merchantMessage: [], //商家信息
                terraceMessage: [], //平台信息
                repulseMessage: ''
            };
            this.vue = new Vue({
                el: '.reOperation_main',
                data: this.$scope,
                methods: {
                    goBack: function () {
                        self.goBack();
                    },
                    onEnter: function (url) {
                        self.onEnter(url);
                    },
                    refuseActive: function (index) {
                        self.refuseActive(index);
                    },
                    callOffActive: function (index) {
                        self.callOffActive(index);
                    },
                    affirmPayActive: function (index) {
                        self.affirmPayActive(index);
                    },
                    repulseActive: function () { //提交拒绝信息
                        self.repulseActive();
                    }
                }
            })
        },
        goBack: function () {
            tool.back();
        },
        onEnter: function (url) {
            tool.go(url);
        },
        refuseActive: function (index) {
            this.$scope.mainShow = index;
        },
        callOffActive: function (index) {
            this.$scope.mainShow = index;
        },
        affirmPayActive: function (index) {
            this.$scope.mainShow = index;
        },
        merchandiseNews: function () {
            var UserInfo = tool.getUserInfo();
            this.$scope.babyMessage = [];
            if ($state.getParams().commodityMessage[0]) {
                var commodityMessage = $state.getParams().commodityMessage[0];
                this.$scope.babyMessage.push({
                    skuPhoto: commodityMessage.skuPhoto, //图片
                    goodsName: commodityMessage.goodsName, //名称
                    num: commodityMessage.num,
                    skuDetail: commodityMessage.skuDetail,
                    price: commodityMessage.price,
                    orderNo: commodityMessage.orderNo,
                    createDate: commodityMessage.createDate
                });
                var refundNo = $state.getParams().refundNo;
                this.service.refundOperationListType({
                    token: UserInfo.token,
                    refundNo: refundNo
                });
            };
        },
        changeRefundOperationTypeCallback: function (result) {
            var self = this;
            if (result.status && result.data) {
                var data = result.data;
                self.$scope.userMessage.push({
                    userId: data.detail.userId, //用户ID
                    createTime: data.createTime, //时间 
                    applicationReason: data.applicationReason //申请理由
                });
                self.$scope.terraceMessage.push({
                    refundId: data.detail.refundId, //退款ID
                    startDate: data.detail.startDate, //开始时间
                    endDate: data.detail.endDate, //结束时间
                    refundNo: data.detail.refundNo, //申请编号
                    surplusTime: ''
                });
                if (data.detail.endDate) {
                    var year = data.detail.endDate.substring(0, 4);
                    var month = data.detail.endDate.substring(5, 7);
                    var day = data.detail.endDate.substring(8, 10);
                    var hour = data.detail.endDate.substring(11, 13);
                    var minute = data.detail.endDate.substring(14, 16);
                    var second = data.detail.endDate.substring(17, 19);
                    const endTime = new Date(year, month - 1, day, hour, minute, second);
                    var curShowTimeSeconds = 0;
                    var curTime = new Date();
                    var ret = endTime.getTime() - curTime.getTime();
                    ret = Math.round(ret / 1000);
                    if (ret) {
                        curShowTimeSeconds = ret;
                        var newDay = parseInt(curShowTimeSeconds / 86400);
                        var surplusOne = curShowTimeSeconds - (newDay * 24 * 60 * 60);
                        var newHour = parseInt(surplusOne / 3600);
                        var surplusTwo = curShowTimeSeconds - (newDay * 24 * 60 * 60) - (newHour * 60 * 60);
                        var newMinute = parseInt(surplusTwo / 60);
                        self.$scope.terraceMessage[0].surplusTime = newDay + '天' + newHour + '时' + newMinute + '分之前';
                    } else {
                        curShowTimeSeconds = 0;
                        self.$scope.terraceMessage[0].surplusTime = "已自动退款";
                    };
                };
            };
        },
        repulseActive: function () { //提交拒绝信息
            //  console.log(this.$scope.repulseMessage);
            var UserInfo = tool.getUserInfo();
            var refundNo = $state.getParams().refundNo;
            this.service.updateRefundCodeType({
                token: UserInfo.token,
                refundNo: refundNo,
                refundId: this.$scope.terraceMessage.refundId,
                operReason: this.$scope.repulseMessage,
                type: 2
            });
        },
        changeupdateRefundCodeTypeCallback: function (result) {
            if (result.status && result.msg) {
                console.log(JSON.stringify(result.data));
                tool.alert(result.msg);
                tool.go('#/reimburseAndSale');
            }
        }
}