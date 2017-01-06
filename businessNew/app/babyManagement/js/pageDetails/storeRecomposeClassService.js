
var tool = require('../../../../public/component/toollib.js');

module.exports = storeClassService;

function storeClassService(scope) {
	this.scope = scope; 
    this.getGoodsCategory = '/Shop/Index/customCategoryList';
}
storeClassService.prototype = {
	fetchBabyType:function(typeId, index) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.getGoodsCategory,
			type: 'POST',	
			dataType: 'json',
			data: {
				shopId: typeId
			}
		});
		service.then(function(result) {
			self.scope.changeStoreClassCallback(result, index);
		}, function(error) {
			console.error('网络服务出错');
		});
	}
}