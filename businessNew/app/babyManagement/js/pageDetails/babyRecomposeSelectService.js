
var tool = require('../../../../public/component/toollib.js');

module.exports = BabySelectService;

function BabySelectService(scope) {
	this.scope = scope; 
    this.getGoodsCategory = '/home/Merchant/getGoodsCategory';
}
BabySelectService.prototype = {
	fetchBabyType:function(typeId, index) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.getGoodsCategory,
			type: 'POST',	
			dataType: 'json',
			data: {
				cid: typeId
			}
		});
		service.then(function(result) {
			self.scope.changeBabySelectTypeCallback(result, index);
		}, function(error) {
			console.error('网络服务出错');
		});
	}
}