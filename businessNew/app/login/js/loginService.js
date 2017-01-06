
var tool = require('../../../public/component/toollib.js');
module.exports = LoginServer;

function LoginServer(scope) {
	this.scope = scope; 
	this.loginByPhoneNum = '/user/login/loginByPhoneNum';
	this.checkShopId = '/Merchant/Index/checkShopId';
}
LoginServer.prototype = {
	login:function(phoneNum, pwd) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.loginByPhoneNum,
			type: 'POST',	
			dataType: 'json',
			data: {
				phoneNum: phoneNum,
				pwd: pwd
			}
		});
		service.then(function(result) {
			self.scope.loginCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	},
	checkShop: function(token) {
		var service = new tool.Service();
		var self = this;
		service.ajax({
			url: this.checkShopId,
			type: 'POST',
			dataType: 'json',
			data: {
				token: token
			}
		});
		service.then(function(result) {
			self.scope.checkShopCallback(result);
		}, function(error) {
			console.error('网络服务出错');
		});
	}
}