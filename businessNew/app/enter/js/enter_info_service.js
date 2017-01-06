var tool = require("../../../public/component/toollib");
module.exports = EnterInfoService;

function EnterInfoService(scope) {
    this.scope = scope;
    this.shopSettle = "/Shop/Index/shopSettle";
};
EnterInfoService.prototype = {
    saveShopSimple: function (options) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.shopSettle,
            dataType: "json",
            data: options
        });
        service.then(function (result) {
            self.scope.saveShopSimpleCallback(result);
        }, function (error) {
            alert(JSON.stringify(error))
            alert("后台数据错误!")
        })
    }
}