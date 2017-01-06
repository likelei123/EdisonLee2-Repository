var tool = require('../../../../public/component/toollib.js');

module.exports = babyStandardService;

function babyStandardService(scope) {
	this.scope = scope;
	this.getGoodsCategory = '/home/Merchant/getSpecAttr';
	this.addAttrValueCategory = '/home/Merchant/addAttrValue';
}
babyStandardService.prototype = {
	fetchBabyType: function (attributeId, shopId) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.getGoodsCategory,
			type: 'POST',
			dataType: 'json',
			data: {
				attributeId: attributeId,
				shopId: shopId
			}
		});
		service.then(function (result) {
			self.scope.changebabyStandardTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	},
	addAttrValueType: function (attributeId, value, shopId) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.addAttrValueCategory,
			type: 'GET',
			dataType: 'json',
			data: {
				attributeId: attributeId,
				value: value,
				shopId: shopId
			}
		});
		service.then(function (result) {
			self.scope.changeaddAttrValueTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	}
}