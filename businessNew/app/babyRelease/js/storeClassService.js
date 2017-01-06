
var tool = require('../../../public/component/toollib.js');

module.exports = storeClassService;

function storeClassService(scope) {
	this.scope = scope; 
    this.getGoodsCategory = '/Shop/Index/customCategoryList';
	this.addCustomCategory='/Shop/Index/addCustomCategory'; //添加自分类
}
storeClassService.prototype = {
	fetchBabyType:function(shopId) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.getGoodsCategory,
			type: 'POST',	
			dataType: 'json',
			data: {
				shopId: shopId
			}
		});
		service.then(function(result) {
			self.scope.changeStoreClassCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	},
	addFetchBabyType:function(option) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.addCustomCategory,
			type: 'POST',	
			dataType: 'json',
			data: option
		});
		service.then(function(result) {
			self.scope.changeaddCustomCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	}
}