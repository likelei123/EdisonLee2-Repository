var tool = require("../../../public/component/toollib");
module.exports = IndexService;

function IndexService(scope) {
    this.scope = scope;
    this.storeInfo = "/Shop/Index/storeInfo";
    this.storeTransactionVolume = '/Shop/Index/storeTransactionVolume';
    this.getBasicsUrl = "/Shop/Index/empInfoByPhone";
    this.storeStop = "/Shop/Index/storeStop";
};
IndexService.prototype = {
    stopShop: function(params) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.storeStop,
            dataType: "json",
            data: params
        });
        service.then(function (result) {
            self.scope.stopShopCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    fetchShopInfo: function (shopId) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.storeInfo,
            dataType: "json",
            data: {
                shopId: shopId
            }
        });
        service.then(function (result) {
            self.scope.fetchShopInfoCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    fetchVolume: function (ops) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.storeTransactionVolume,
            dataType: "json",
            data: ops
        });
        service.then(function (result) {
            self.scope.fetchVolumeCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        });
    },
    fetchPermission: function(params) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.getBasicsUrl,
            dataType: "json",
            data: params
        });
        service.then(function (result) {
            self.scope.fetchPermissionCallback(result);
        }, function (error) {
            tool.alert("后台数据错误!");
        });
    }
}