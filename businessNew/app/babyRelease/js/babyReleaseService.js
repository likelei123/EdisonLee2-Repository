var tool = require('../../../public/component/toollib.js');

module.exports = BabyReleaseServer;

function BabyReleaseServer(scope) {
	this.scope = scope;
	this.getGoodsCategory = '/home/Merchant/getGoodsCategory';
	this.addMerchandise = "/home/Merchant/addMerchandise"; //发布 
	this.getGoodsCategory = '/home/Merchant/getGoodsAttrName'; //属性
}
BabyReleaseServer.prototype = {
	fetchBabyType: function (typeId, index) {
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
		service.then(function (result) {
			self.scope.changeBabySelectTypeCallback(result, index);
		}, function (error) {
			console.error('网络服务出错');
		});
	},
	addBabyType: function (token, shopId, appId, merchandiseInfo) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.addMerchandise,
			type: 'POST',
			dataType: 'json',
			data: {
				token: token,
				shopId: shopId,
				appId: appId,
				merchandiseInfo: merchandiseInfo
			}
		});
		service.then(function (result) {
			self.scope.addMerchandiseCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	},
	getGoodsType: function (typeId) {
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
		service.then(function (result) {
			self.scope.changebabyPropertyTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	}
}