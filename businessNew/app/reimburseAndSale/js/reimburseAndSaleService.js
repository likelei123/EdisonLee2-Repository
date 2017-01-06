var tool = require('../../../public/component/toollib.js');

module.exports = reimburseAndSaleService;

function reimburseAndSaleService(scope) {
    this.scope = scope;
    this.RefundOrderListCategory = '/Iorder/Iorder/RefundOrderList';
    this.refundOrderCountByCode = '/OrderRefund/OrderRefund/refundOrderCountByCode'; //订单各状态的数量
}
reimburseAndSaleService.prototype = {
    RefundOrderListType: function (option) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            url: this.RefundOrderListCategory,
            type: 'POST',
            dataType: 'json',
            data: option
        });
        service.then(function (result) {
            self.scope.changereimburseAndSaleTypeCallback(result);
        }, function (error) {
            console.error('网络服务出错');
        });
    },
    refundOrderCountByCodeType: function (option) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            url: this.refundOrderCountByCode,
            type: 'POST',
            dataType: 'json',
            data: option
        });
        service.then(function (result) {
            self.scope.changerefundOrderCountByCodeTypeCallback(result);
        }, function (error) {
            console.error('网络服务出错');
        });
    }
}