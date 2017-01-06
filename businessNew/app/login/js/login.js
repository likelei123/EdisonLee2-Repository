
require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/login.scss');
var Vue = require('../../../public/lib/vue.js');
var tool = require('../../../public/component/toollib.js');
var text = require('../view/login.html');
var	LoginService = require('./loginService.js');

module.exports = {
	init: function($el) {
		this.$el = $el || $(document.body);
		this.render();
		this.service = new LoginService(this);
	},
	render: function() {
		this.$el.html(text);
		this.$scope = {
			isCheck: false,
			phoneNum: '',
			pwd: ''
		};

		this.$scope.phoneNum = localStorage.getItem('phoneNum');
		this.$scope.pwd = localStorage.getItem('pwd');
		if(this.$scope.phoneNum) {
			this.$el.find('#login-box-checkbox').attr('checked', 'checked');
		}

		var self = this;
		this.vue = new Vue({
			el: '.login-box',
			data: this.$scope,
			methods: {
				onLogin: function() { self.onLogin() },
				onRegister: function() { self.onRegister() },
				onForgetPwd: function() { self.onForgetPwd() },
				onRememberPwd: function() { self.onRememberPwd() }
			}
		});
	},
	onLogin: function() {
		//先前端验证在请求登录
		// tool.go('#/index');
		// return ;
		this.service.login(
			this.$scope.phoneNum, 
			this.$scope.pwd
		);
	},
	onRegister: function() {
		tool.go('#/register'); 
	},
	onForgetPwd: function() {
		tool.go('#/login/forgetpassword',{tagname:'ForgetPassword'});
	},
	onRememberPwd: function() {
		localStorage.setItem('isRememberPwd', !this.$scope.isCheck);
		this.$scope.isCheck = !this.$scope.isCheck;
	},
	loginCallback: function(result) {
		if(result.status) {
			sessionStorage.clear();
			tool.setUserInfo(result.data);
			tool.setInitAndroidInfo(result.data);
			this.service.checkShop(result.data.token);	
		} else {
			tool.alert(result.msg);
		}

		// tool.setUserInfo({
		// 	token: '2ab308ab457187d35c84d314278987c4f176a63e'
		// });
		// this.service.checkShop('2ab308ab457187d35c84d314278987c4f176a63e');
	},
	checkShopCallback: function(result) {
		if(result.status) {
			if(result.data) {
				var user = tool.getUserInfo();
				user.shopId = result.data.shopId;
				user.shopInfo = result.data;
				tool.setUserInfo(user);

				if(this.$el.find('#login-box-checkbox').is(':checked')) {
					localStorage.setItem('phoneNum', this.$scope.phoneNum);
					localStorage.setItem('pwd', this.$scope.pwd);
				} else {
					localStorage.setItem('phoneNum', '');
					localStorage.setItem('pwd', '');
				}
				
				tool.go('#/index');
			} else {
				tool.alert("后台返回信息：->"+result.msg);
			}
		} else {
			tool.alert('基本信息不完整，即将跳转基本信息页！');
				setTimeout(function() {
					tool.go('#/enter_map');
				}, 1000);
		}
	},

};