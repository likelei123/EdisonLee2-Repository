var tool = require("../../../public/component/toollib");
module.exports = AddressIndex;

function AddressIndex(scope) {
    console.log(scope)
    this.scope = scope;
    this.getShopAddr = "/Shop/Index/getShopAddr"
};
AddressIndex.prototype = {
    AddressMassage: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "GET",
            url: this.getShopAddr,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.AddressMassageData(result);
        }, function (error) {
            alert("后台数据错误")
        })
    }
}