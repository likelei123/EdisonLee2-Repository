var tool = require('../../../public/component/toollib.js');

module.exports = refundOperationService;

function refundOperationService(scope) {
    this.scope = scope;
    this.refundOperationListCategory = '/OrderRefund/OrderRefund/OrderRefundDetail';
    this.updateRefundCode = '/OrderRefund/OrderRefund/updateRefundCode'; //拒绝申请 回复信息
    ;
}
refundOperationService.prototype = {
    refundOperationListType: function (option) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            url: this.refundOperationListCategory,
            type: 'POST',
            dataType: 'json',
            data: option
        });
        service.then(function (result) {
            self.scope.changeRefundOperationTypeCallback(result);
        }, function (error) {
            console.error('网络服务出错');
        });
    },
    updateRefundCodeType: function (option) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            url: this.updateRefundCode,
            type: 'POST',
            dataType: 'json',
            data: option
        });
        service.then(function (result) {
            self.scope.changeupdateRefundCodeTypeCallback(result);
        }, function (error) {
            console.error('网络服务出错');
        });
    }
}