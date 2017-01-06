
var tool = require('../../../../public/component/toollib.js');

module.exports = babyPropertyService;

function babyPropertyService(scope) {
	this.scope = scope; 
    this.getGoodsCategory = '/home/Merchant/getGoodsAttrName';
}
babyPropertyService.prototype = {
	fetchBabyType:function(typeId) {
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
			self.scope.changebabyPropertyTypeCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	}
}