require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/shopInfo.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/shopInfo.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var ShopInfoServic = require("../js/shopinfoService.js");
window.empImgback = function (ops) {
	scope.empImgback(ops)
}
window.empImgback2 = function (ops) {
	scope.empImgback2(ops)
}
var scope = null;
module.exports = scope = {
	init: function ($el) {
		this.$el = $el || $(document.body);
		this.render();
		this.service = new ShopInfoServic(this)
		this.initVue();
	//	this.JudgeAdmin();
		this.isAdmin();
	},
	render: function () {
		this.$el.html(text);
	},
	initVue: function () {
		var self = this;
		this.$scope = {
			state: {},
			data: {},
			test: '\u6e05\u534e\u5927\u5b66',
			show_hide: false, //控制挡板的显隐;
			set_info: {
				shopLogo: "",
				shopTel: "",
				beginTime: "",
				endTime: "",
				shopAddress: "",
				shopPhoto: ""
			}
		}

		this.vue = new Vue({
			el: '.shop-info-box',
			data: this.$scope,
			methods: {
				onBack: function () {
					self.onBack();
				},
				SetstoreInfoEditData: function (params) {
					self.SetstoreInfoEditData();
				}
			},
			ready: function () {
				self.SetStoredata();
			}
		});
	},
	onBack: function () {
		tool.back();
	},
	//判断是否是管理员
	JudgeAdmin: function () {
		var UserInfo = tool.getUserInfo();
		var admi = 1;
		if (admi == 1) {
			this.$scope.show_hide = false;
		} else {
			this.$scope.show_hide = true;
		}
	},
	//获取到基本信息
	SetStoredata: function () {
		var UserInfo = tool.getUserInfo();
		var Storeobj = {
			shopId: UserInfo.shopId
		};
		this.service.SetStoreInfo(Storeobj);
	},
	BackStoreInfoData: function (data) {
		console.log(data);
		if (data.status) {
			this.$scope.data = data.data;
		} else {
			tool.alert("没有此商铺")
		}
	},
	//修改基本信息
	SetstoreInfoEditData: function () {
		var UserInfo = tool.getUserInfo();
		var scope = this.$scope;
		if (UserInfo) {
			scope.set_info.shopId = UserInfo.shopId;
			scope.set_info.token = UserInfo.token;
			if (scope.set_info.beginTime.split(":").length < 3) {
				scope.set_info.beginTime = scope.set_info.beginTime + ":00";
			} else {
				scope.set_info.beginTime = scope.set_info.beginTime
			}
			if (scope.set_info.endTime.split(":").length < 3) {
				scope.set_info.endTime = scope.set_info.endTime + ":00";
			} else {
				scope.set_info.endTime = scope.set_info.endTime
			}
			console.log(scope.set_info.beginTime);
			console.log(scope.set_info.endTime);
			
				//scope.set_info.endTime = scope.set_info.endTime+":00"
			this.service.SetEditInfo(scope.set_info)
		} else {
			tool.alert("此商铺是否添加成功请查看")
		}

	},
	BackstoreInfoEditData: function (data) {
		if (data.status) {
			tool.alert("恭喜您修改成功");
			setTimeout(function () {
				tool.back();
			}, 2000)

		} else {
			tool.alert(data.msg)
		}
		console.log(data)
	},
	//图片上传
	empImgback: function (ops) {
		var ops = ops;
		var self = this;
		tool.imgFileUploads(ops, function (result) {
			if (result.length > 0) {
				self.$scope.set_info.shopLogo = "";
				self.$scope.data.shopLogo = "";
				self.$scope.set_info.shopLogo = result[0];
				self.$scope.data.shopLogo = result[0];
			} else {
				tool.alert('图片加载失败！');
			}
		});
	},
	empImgback2: function (ops) {
		var ops = ops;
		var self = this;
		tool.imgFileUploads(ops, function (result) {
			if (result.length > 0) {
				self.$scope.set_info.shopPhoto = "";
				self.$scope.data.shopPhoto = "";
				self.$scope.set_info.shopPhoto = result[0];
				self.$scope.data.shopPhoto = result[0];
			} else {
				tool.alert('图片加载失败！');
			}
		});
	},
	//判断是否有操作权限
	isAdmin:function () {
			var admin=$state.getParams().isAdmin;
			var scope=this.$scope;
			if(admin==1){
				scope.show_hide=false;
			}else{
				scope.show_hide=true;
			}
	  }
}