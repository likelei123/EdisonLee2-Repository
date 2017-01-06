require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/reimburseAndSale.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/reimburseAndSale.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

var reimburseAndSaleService = require('./reimburseAndSaleService.js');
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.service = new reimburseAndSaleService(this);
        this.render();
        this.initVue();
        this.currentNodeCodeStatus();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            items: [],
            navStatus: 3, //导航选择
            create: '', // 进行中数量
            finish: '', //已完成数量
            total: '' //全部数量
        };
        this.vue = new Vue({
            el: '.reimburseAndSale_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                onEnter: function (url) {
                    self.onEnter(url);
                },
                itemToolActive: function (index) {
                    self.itemToolActive(index);
                },
                navActive: function (index) {
                    self.navActive(index);
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
    itemToolActive: function (index) {
        // var item = this.$scope.items;
        // if (item[index].title[0].stat) {
        //     tool.go('#/refundOperation');
        // } else {
        //     tool.go('#/dealRefund');
        // }
        if (this.$scope.items[index].nextRefundNodeCode == 'REFUND_AGREE') {
            tool.go('#/refundOperation', {
                refundNo: this.$scope.items[index].refundNo,
                commodityMessage: [{
                    skuPhoto: this.$scope.items[index].skuPhoto, //图片
                    goodsName: this.$scope.items[index].goodsName, //名称
                    num: this.$scope.items[index].num,
                    skuDetail: this.$scope.items[index].skuDetail,
                    price: this.$scope.items[index].price,
                    orderNo: this.$scope.items[index].orderNo,
                    createDate: this.$scope.items[index].createDate
                }]
            });
            // tool.go('#/dealRefund');
        } else {
            tool.go('#/dealRefund', {
                refundNo: this.$scope.items[index].refundNo,
                commodityMessage: [{
                    skuPhoto: this.$scope.items[index].skuPhoto, //图片
                    goodsName: this.$scope.items[index].goodsName, //名称
                    num: this.$scope.items[index].num,
                    skuDetail: this.$scope.items[index].skuDetail,
                    price: this.$scope.items[index].price,
                    orderNo: this.$scope.items[index].orderNo,
                    createDate: this.$scope.items[index].createDate
                }]
            });
        }
    },
    currentNodeCodeStatus: function () { //初始状态
        this.$scope.items = [];
        var UserInfo = tool.getUserInfo();
        this.service.RefundOrderListType({
            token: UserInfo.token,
            shopId: UserInfo.shopId,
            currentNodeCode: null,
            odrerType: null
        });
        this.service.refundOrderCountByCodeType({
            token: UserInfo.token,
            shopId: UserInfo.shopId
        });
    },
    changerefundOrderCountByCodeTypeCallback: function (result) { //返回订单各状态的数量
        var self = this;
        if (result.status && result.data) {
            console.log(JSON.stringify(result.data));
            self.$scope.create = result.data.create;
            self.$scope.finish = result.data.finish;
            self.$scope.total = result.data.total;
        }
    },
    navActive: function (index) {
        this.$scope.navStatus = index;
        var UserInfo = tool.getUserInfo();
        if (index == 1) {
            this.service.RefundOrderListType({
                token: UserInfo.token,
                shopId: UserInfo.shopId,
                currentNodeCode: 'REFUND_CREATE'
            });
        } else if (index == 2) {
            this.service.RefundOrderListType({
                token: UserInfo.token,
                shopId: UserInfo.shopId,
                currentNodeCode: 'REFUND_SUCCESS'
            });
        } else if (index == 3) {
            this.service.RefundOrderListType({
                token: UserInfo.token,
                shopId: UserInfo.shopId,
                currentNodeCode: null,
                odrerType: null
            });
        };
    },
    changereimburseAndSaleTypeCallback: function (result) {
        this.$scope.items = [];
        var self = this;
        if (result.status && result.data) {
            console.log(JSON.stringify(result.data));
            $.each(result.data, function (index, item) {
                self.$scope.items.push({
                    shopName: item.shopName,
                    goodsId: item.goods[0].goodsId,
                    goodsName: item.goods[0].goodsName,
                    price: item.goods[0].price,
                    skuPhoto: item.goods[0].skuPhoto,
                    num: item.goods[0].num,
                    createDate: item.createDate.substring(0, 10),
                    orderNo: item.orderNo,
                    skuDetail: [], //属性值
                    isRefund: item.goods[0].isRefund, //是否为退款商品
                    refundNo: item.goods[0].refundNo, //退款申请编号
                    currentRefundNodeCode: item.goods[0].currentRefundNodeCode,
                    nextRefundNodeCode: item.goods[0].nextRefundNodeCode,
                    currentRefundNodeCodeText: '',
                    currenttime: false
                });
            });
            $.each(result.data, function (index, item) {
                $.each(item.goods[0].skuDetail, function (val, deta) {
                    self.$scope.items[index].skuDetail.push({
                        skuAttrClass: deta.skuAttrClass,
                        skuAttrId: deta.skuAttrId,
                        skuAttrVal: deta.skuAttrVal
                    })
                })
            });
            $.each(self.$scope.items, function (index, item) {
                if (item.currentRefundNodeCode == "REFUND_CREATE") {
                    item.currentRefundNodeCodeText = '申请中';
                    item.currenttime = true;
                } else if (item.currentRefundNodeCode == "REFUND_SUCCESS") {
                    item.currentRefundNodeCodeText = '退款成功';
                } else if (item.currentRefundNodeCode == "REFUND_FAILED") {
                    item.currentRefundNodeCodeText = '退款失败';
                } else if (item.currentRefundNodeCode == "REFUND_CLOSE") {
                    item.currentRefundNodeCodeText = '退款关闭';
                } else if (item.currentRefundNodeCode == "PLATFORM_IN") {
                    item.currentRefundNodeCodeText = '平台介入';
                };
            });
        };
    }
}