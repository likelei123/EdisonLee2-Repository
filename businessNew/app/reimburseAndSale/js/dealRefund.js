require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/dealRefund.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/dealRefund.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

var dealRefundService = require('./refundOperationService.js');
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.service = new dealRefundService(this);
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
            babyMessage: [] //商品信息
        };
        this.vue = new Vue({
            el: '.dealRefund_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                onEnter: function (url) {
                    self.onEnter(url);
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
        if (result.status && result.data) {
            console.log(JSON.stringify(result.data));
        };
    }

}