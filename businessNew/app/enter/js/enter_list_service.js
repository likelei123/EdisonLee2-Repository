var tool = require("../../../public/component/toollib");
module.exports = EnterListService;

function EnterListService(scope) {
    this.scope = scope;
    this.merchantList = "/Merchant/Index/merchantList";
    this.shopClaim = "/Merchant/Index/shopClaim";
};
EnterListService.prototype = {
    fetchShopList: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "GET",
            url: this.merchantList,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.changeShopListData(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    checkShopStatus: function(code) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.shopClaim,
            dataType: "json",
            data: {
                shopCode: code
            }
        });
        service.then(function (result) {
            result._code_ = code;
            self.scope.checkShopStatusCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    }
}