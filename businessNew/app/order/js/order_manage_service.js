var tool = require("../../../public/component/toollib");
module.exports = OrderManageService;

function OrderManageService(scope) {
    this.scope = scope;
    this.orderList = "/Iorder/Iorder/orderList";
};
OrderManageService.prototype = {
    fetchOrderList: function (res) {
        var register = new tool.Service();
        var self = this;
        register.ajax({
            type: "POST",
            url: this.orderList,
            dataType: "json",
            data: res
        });
        register.then(function (result) {
            self.scope.fetchOrderListCallback(result)
        }, function (error) {
            tool.alert("后台出错");
        })
    }
}