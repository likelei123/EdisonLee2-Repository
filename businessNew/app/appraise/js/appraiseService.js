
var tool = require('../../../public/component/toollib.js');
module.exports = AppraiseService;

function AppraiseService(scope) {
	this.scope = scope; 
	this.getGoodsCmtBySid = '/Comment/Comment/getGoodsCmtBySid';
	this.customCategoryList = '/Shop/Index/customCategoryList';
	this.replyGoodsCmt = '/Comment/Comment/replyGoodsCmt';
}
AppraiseService.prototype = {
	fetchComments: function(params) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.getGoodsCmtBySid,
			type: 'POST',	
			dataType: 'json',
			data: params
		});
		service.then(function(result) {
			self.scope.fetchCommentsCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	},
	fetchClassify: function(params) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.customCategoryList,
			type: 'POST',	
			dataType: 'json',
			data: params
		});
		service.then(function(result) {
			self.scope.fetchClassifyCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	},
	replyComments: function(params) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.replyGoodsCmt,
			type: 'POST',	
			dataType: 'json',
			data: params
		});
		service.then(function(result) {
			self.scope.replyCommentsCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	}
}