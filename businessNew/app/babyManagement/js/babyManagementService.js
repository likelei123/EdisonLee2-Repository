var tool = require('../../../public/component/toollib.js');

module.exports = babyManagementService;

function babyManagementService(scope) {
	this.scope = scope;
	this.getGoodsCategory = '/home/Merchant/CommodityScreeningByStore'; //商品列表
	this.customCategoryList = "/Shop/Index/customCategoryList"; //分类列表
	this.deleteMerchandise = "/home/Merchant/delGoodsByIds"; //删除商品
	this.setUpDwonGoodsByIds = "/home/Merchant/setUpDwonGoodsByIds"; //批量下架'
	// this.setRecommendByIds = "/home/Merchant/setRecommendByIds"; //批量 1 推送橱窗 0移除推送
	this.getGoodsEachStatusNum = '/home/Merchant/getGoodsEachStatusNum'; //查询在售、橱窗、仓库、审核中商品的数量
}
babyManagementService.prototype = {
	getGoodsType: function (opcition) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.getGoodsCategory,
			type: 'POST',
			dataType: 'json',
			data: opcition
		});
		service.then(function (result) {
			self.scope.changebabyManagementTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	},
	customType: function (shopId) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.customCategoryList,
			type: 'POST',
			dataType: 'json',
			data: {
				shopId: shopId
			}
		});
		service.then(function (result) {
			self.scope.changeCustomTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	},
	deleType: function (option) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.deleteMerchandise,
			type: 'POST',
			dataType: 'json',
			data: option
		});
		service.then(function (result) {
			self.scope.changeDeleTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	},
	setUpDwonType: function (option) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.setUpDwonGoodsByIds,
			type: 'POST',
			dataType: 'json',
			data: option
		});
		service.then(function (result) {
			self.scope.changeSetUpDwonTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	},
	// setRecommendType: function (option) {
	// 	var service = new tool.Service();
	// 	var self = this;
	// 	service.ajax({
	// 		url: this.setRecommendByIds,
	// 		type: 'POST',
	// 		dataType: 'json',
	// 		data: option
	// 	});
	// 	service.then(function (result) {
	// 		self.scope.changeSetRecommendTypeCallback(result);
	// 	}, function (error) {
	// 		console.error('网络服务出错');
	// 	});
	// },
	getGoodsEachStatusNumType: function (option) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.getGoodsEachStatusNum,
			type: 'POST',
			dataType: 'json',
			data: option
		});
		service.then(function (result) {
			self.scope.changegetGoodsEachStatusNumTypeCallback(result);
		}, function (error) {
			console.error('网络服务出错');
		});
	}
}