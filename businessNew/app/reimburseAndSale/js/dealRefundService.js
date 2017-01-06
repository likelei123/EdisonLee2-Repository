var tool = require('../../../public/component/toollib.js');

module.exports = dealRefundService;

function refundOperationService(scope) {
    this.scope = scope;
    this.refundOperationListCategory = '/OrderRefund/OrderRefund/OrderRefundDetail';
}
dealRefundService.prototype = {
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
    }

}