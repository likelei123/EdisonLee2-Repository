require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/forgetPassword.scss');

var tool = require('../../../public/component/toollib.js');
var Vue = require('../../../public/lib/vue.js');
var $state = require('../../../public/component/$state.js');
var text = require('../view/forgetPassword.html');
var passwordService = require("../js/forgetPasswordService")

module.exports = {
	init: function ($el) {
		this.$el = $el || $(document.body);
		this.render();
		this.service = new passwordService(this)
		this.initVue();
		this.activeButton();

	},
	render: function () {
		this.$el.html(text);
	},
	initVue: function () {
		this.$scope = {
			states: {
				title: "",
				forget: false,
				change:false,
				tixian:false,
				phone: "",
				code: "",
				pas: "",
				repas: ""
			}
		};

		var self = this;
		this.vue = new Vue({
			el: '.forget-password-box',
			data: this.$scope,
			methods: {
				onBack: function () {
					self.onBack()
				},
				Ondetermine: function () {
					self.Ondetermine();
				},
				Onsave:function (params) {
					self.Onsave();
				}
			},
			ready: function () {
				self.JudgeState();
			}
		});
	},
	JudgeState: function () {
		if ($state.getParams().tagname == "ForgetPassword") {
			this.$scope.states.title = "忘记密码";
			this.$scope.states.forget = true;
			this.$scope.states.change = false;
			this.$scope.states.tixian=false;
		} else if ($state.getParams().tagname == "ChangePassword") {
			this.$scope.states.title = "修改密码";
			this.$scope.states.change = true;
			this.$scope.states.forget = false;
			this.$scope.states.tixian=false;
		}else if($state.getParams().tagname == "WithdrawalPassword"){
			this.$scope.states.title = "提现密码";
			this.$scope.states.tixian=true;
			this.$scope.states.change = false;
			this.$scope.states.forget = false;
		}
	},
	activeButton: function () {
		var self = this;
		var $button = this.$el.find('.button');
		var $input = this.$el.find('input[xtype=phone]');
		this.button = new tool.PhoneValidateCodeButton(1, $button, 15, $input, function (backdata) {
			if (backdata.status) {
				self.$scope.states.code = backdata.msg;
				console.log(self)
			} else {
				tool.alert(backdata.msg)
			}
		});
	},
	onBack: function () {
		tool.back();
	},
	//忘记密码的操作
	Ondetermine: function () {
		var myscope = this.$scope.states;
		var reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
		var newpasswold = myscope.pas;
		var respassword = myscope.repas;
		if (!reg.test(newpasswold)) {
			tool.alert("请输入6-16位，支持字母、数字、下划线");
			return false;
		} else if (newpasswold != respassword) {
			tool.alert("重复密码应该和设置密码一致");
			return false;
		} else {
			var findpassworld = {
				phoneNum: myscope.phone,
				verifyCode: myscope.code,
				newPassword: myscope.pas
			};
			this.service.SetPasswordByPhone(findpassworld);
		}
	},
	PasswordByPhoneCallback: function (data) {
		console.log(data)
		if (data.msg) {
			tool.alert("恭喜您修改成功");
			setTimeout(function (paras) {
				tool.back();
			}, 1000)
		} else {
			tool.alert(data.msg)
		}
	},

	//修改密码
	Onsave: function () {
		var myscope = this.$scope.states;
		var reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
		var newpasswold = myscope.pas;
		var respassword = myscope.repas;
		if (!reg.test(newpasswold)) {
			tool.alert("请输入6-16位，支持字母、数字、下划线");
			return false;
		} else if (newpasswold != respassword) {
			tool.alert("重复密码应该和设置密码一致");
			return false;
		} else {
			var UserInfo = tool.getUserInfo();
			var Modifyobj = {
				verifyCode: myscope.code,
				repassword: myscope.pas,
				token: UserInfo.token
			};
			this.service.SetRePassword(Modifyobj);
		}
	},
	RePasswordCallback:function (data) {
		console.log(data)
		if(data.status){
			tool.alert("修改成功");
			setTimeout(function () {
				tool.back();
			},1000)
		}else{
			tool.alert(data.msg)
		}
	}
}