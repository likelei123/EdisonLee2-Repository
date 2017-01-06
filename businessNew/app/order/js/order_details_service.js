var tool = require("../../../public/component/toollib");
module.exports = OrderDetailService;

function OrderDetailService(scope) {
    this.scope = scope;
    this.OrderDetail = "/Iorder/Iorder/OrderDetail";
    this.SendGoodsOrder = "/Iorder/Iorder/SendGoodsOrder";
    this.ConsumeOrder = "/Iorder/Iorder/ConsumeOrder";
};
OrderDetailService.prototype = {
    fetchOrderDetail: function (res) {
        var register = new tool.Service();
        var self = this;
        register.ajax({
            type: "POST",
            url: this.OrderDetail,
            dataType: "json",
            data: res
        });
        register.then(function (result) {
            self.scope.fetchOrderDetailCallback(result)
        }, function (error) {
            tool.alert("后台出错");
        })
    },
    sendGoodsOrder: function(params) {
        var register = new tool.Service();
        var self = this;
        register.ajax({
            type: "POST",
            url: this.SendGoodsOrder,
            dataType: "json",
            data: params
        });
        register.then(function (result) {
            self.scope.refreshOrderDetailsCallback(result)
        }, function (error) {
            tool.alert("后台出错");
        })
    },
    consumeOrder: function(params) {
        var register = new tool.Service();
        var self = this;
        register.ajax({
            type: "POST",
            url: this.ConsumeOrder,
            dataType: "json",
            data: params
        });
        register.then(function (result) {
            self.scope.refreshOrderDetailsCallback(result)
        }, function (error) {
            tool.alert("后台出错");
        })
    }
}