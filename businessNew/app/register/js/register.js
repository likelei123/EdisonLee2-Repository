require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/register.scss');

var tool = require('../../../public/component/toollib.js');
var Vue = require('../../../public/lib/vue.js');

var text = require('../view/register.html');
var registerService = require("../js/registerService");

module.exports = {
	init: function ($el) {

		this.$el = $el || $(document.body);

		this.render();
		this.initVue();
		this.service = new registerService(this);
	},
	render: function () {
		this.$el.html(text);
		this.activeButton();
	},
	initVue: function () {
		this.$scope = {
			states: {
				phone: "",
				code: "",
				password: "",
				repeat: "",
				backcode: "",
				isAgreement: true
			}
		};
		var self = this;
		this.vue = new Vue({
			el: '.register-box',
			data: this.$scope,
			methods: {
				onBack: function () {
					self.onBack()
				},
				onRegister: function () {
					self.onRegister()
				},
				onAgreement: function() {
					self.onAgreement();
				}
			}
		});
	},
	onBack: function () {
		tool.back();
	},
	onRegister: function () {
		var myscope = this.$scope.states;
		var resObj = {
			phoneNum: myscope.phone,
			pwd: myscope.password,
			verifyCode: myscope.code
		};
		var reg_ph = /^[1][4358][0-9]{9}$/;
		var reg_ps = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
		if(!reg_ph.test(myscope.phone)) {
			tool.alert('手机格式不正确！');
		} else if(myscope.code == "") {
			tool.alert('验证码不能为空！');
		} else if(!(reg_ps.test(resObj.pwd))) {
			tool.alert("请输入6-16的数字和字母");
		} else if (!(resObj.pwd == myscope.repeat)) {
			tool.alert("重复密码应和密码一致");
		} else if(!myscope.isAgreement) {
			tool.alert("请勾选商家注册协议");
		} else {
			this.service.RegisterPhone(resObj);
		}
	},
	onAgreement: function() {
		tool.go("#/enter_agreement");
	},
	loginCallback: function(result) {
		if(result.status) {
			tool.alert('注册第一步完成，即将进入店铺定位！');
			setTimeout(function() {
				tool.setUserInfo(result.data);
				// tool.go("#/enter_agreement");
				tool.go("#/enter_map");
			}, 1000);
		} else {
			tool.alert(result.msg);
		}
	},
	registerPhoneCallback: function (result) {
		var myscope = this.$scope.states;
		if (result.status) {
			this.service.login(myscope.phone, myscope.password);
		} else {
			tool.alert(result.msg)
		}
	},
	activeButton: function() {
		var self = this;
		var $button = this.$el.find('.button');
		var $input = this.$el.find('input[xtype=phone]');
		this.button = new tool.PhoneValidateCodeButton(0,
			$button, 10, $input, function(result) {
			if(result.status) {
				self.$scope.states.code = result.msg;
			} else {
				tool.alert(result.msg);
			}
		});
	}
}