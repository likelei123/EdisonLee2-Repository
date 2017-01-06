require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/enter_list.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state.js");
var text = require("../view/enter_list.html");
var EnterListService = require('./enter_list_service.js');

var scope = null;
window.callback = function(ops) {
    if($.isArray(ops) && ops.length>0 && ops[0]) {
        scope.service.checkShopStatus(ops[0]);
    } else {
        alert('店铺编码取不到！');
    }
};

window.backPage = function() {

};

module.exports = scope = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.point = $state.getParams();
        this.service = new EnterListService(this);
        this.render();
        this.$scope = {
            states: {},
            itmes: [],
            shopName: ""
        };
        this.intVue();
        this.service.fetchShopList({
            'shopName':"",
            'lat':this.point.lat,
            'lng':this.point.lng,
            'distance': 10
        });
        this.load3DView();
    },
    render: function () {
        this.$el.html(text);
    },
    load3DView: function() {
        var self = this;
        setTimeout(function() {
            tool.setView('half');
            tool.load3dShop({
                lat: self.point.lat,
                lng: self.point.lng,
                callback: "callback"
            });
        }, 400);
    },
    change3dView: function(item) {
        // alert(JSON.stringify(item));
        tool.load3dShop({
            lat: item.lat,
            lng: item.lng,
            callback: 'callback'
        });
    },
    enterShopInfo: function(data) {
        if(!data.isOccupancy) {
            var shopInfo = data.shopInfo;
            tool.setView('full');
            setTimeout(function() {
                shopInfo.isRefresh = true;
                tool.go('#/enter_info', shopInfo);
            }, 300);
        } else {
            tool.alert(data.shop_name+'店铺已入驻！');
        } 
        event.stopPropagation();
    },
    intVue: function () {
        var self = this;
        this.vue = new Vue({
            el: ".enter-list",
            data: this.$scope,
            methods: {
                onSearchShopInfo: function() { self.onSearchShopInfo() },
                change3dView: function(item) { self.change3dView(item) },
                enterShopInfo: function(item) { self.enterShopInfo(item) }
            }
        })
    },
    changeShopListData: function(result) {
        var items = this.$scope.itmes;
        items.splice(0, 999);
        $.each(result.data, function(index, item) {
            items.push({
                shopInfo: item,
                lat: item.shopLat,
                lng: item.shopLng,
                shop_name: item.shopName,
                type: item.shopCategoryName,
                isOccupancy: item.enterStatus == 0 ? false : true
            });
        });
    },
    onSearchShopInfo: function() {
        this.service.fetchShopList({
            'shopName':this.$scope.shopName,
            'lat':this.point.lat,
            'lng':this.point.lng,
            'distance': 10
        });
    },
    checkShopStatusCallback: function(result) {
        if(result.status) {
            if(result.data.enterStatus == 2) {
                alert('该店铺已入住！');
            } else {
                tool.setView('full');
                result._isRefresh = true;
                setTimeout(function() {
                    result.data.isRefresh = true;
                    tool.go('#/enter_info', result.data);
                }, 300);
            }
        } else {
            alert(result.msg);
        }
    }
}