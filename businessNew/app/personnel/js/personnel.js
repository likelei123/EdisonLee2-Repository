require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/personnel.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/personnel.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var Personnel = require("../js/personnelService.js");

var moduleText = require('../view/personnel_module.html');
var compileText = require('../view/compile_module.html');
var leaveText = require('../view/leave_module.html');
var leaveOfficeText = require('../view/leaveOffice_module.html');

module.exports = {
	init: function ($el) {
		var Params = $state.getParams();
		this.$el = $el || $(document.body);
		this.render();
		this.service = new Personnel(this);
		this.initVue();

		// this.$scope.items = [{}];
	},
	render: function () {
		var $html = $(text);
		$html.find(".pe_content").append(moduleText);
		$html.find(".pe_compile").append(compileText);
		$html.find(".pe_leave").append(leaveText);
		$html.find(".pe_leaveOffice").append(leaveOfficeText);
		this.$el.html($html);
	},
	initVue: function () {
		var self = this;
		this.$scope = {
			personnel: 1,
			items: [],
			res: {},
			BackNumber: {}
		};
		this.vue = new Vue({
			el: '.personnel_main',
			data: this.$scope,
			methods: {
				goBack: function () {
					self.goBack();
				},
				addPersion: function () {
					self.addPersion();
				},
				editorPersion: function () {
					self.editorPersion();
				},
				parActive: function (index) {
					self.parActive(index);
				},
				Goparticulars_leave: function () {
					self.Goparticulars_leave();
				},
				Goparticulars: function (empid, meg) {
					self.Goparticulars(empid, meg);
				}
			},
			ready: function () {
				self.Obtain(2);
				self.GetNumber();
			}
		})
	},
	goBack: function () {
		tool.back();
	},
	//跳转到添加页面
	addPersion: function () {
		tool.go('#/add', {
			isRefresh: true
		});
	},
	//跳转到编辑页面
	editorPersion: function () {
		tool.go('#/compile');
	},
	Goparticulars_leave: function (empid) {
		tool.go("#/particulars_leave", {
			isRefresh: true,
			empId: empid,
		})
	},
	//跳转到详情页面
	Goparticulars: function (empid, meg) {
		// console.log(empid);
		// $state.emit("empId",empid);
		tool.go("#/particulars", {
			isRefresh: true,
			empId: empid,
			meg: meg
		});
	},
	//判断员工是什么状态
	parActive: function (index) {
		this.$scope.personnel = index;
		var zhiwe;
		if (index == 4) {
			zhiwei = 0;
			this.Obtain(zhiwei);
		} else if (index == 3) {
			zhiwei = 1;
			this.Obtain(zhiwei)
		} else if (index == 1) {
			zhiwei = 2;
			this.Obtain(zhiwei);
		} else {
			zhiwei = 3;
			this.Obtain(zhiwei);
		};

	},
	//根据员工状态发送不同的参数
	Obtain: function (number) {
		var UserInfo = tool.getUserInfo();
		if (UserInfo.token) {
			var message = {
				token: UserInfo.token,
				shopId: UserInfo.shopId,
				status: number
			};
			this.service.Setinfo(message)

		} else {

		}
	},
	//获取员工列表
	GetPersonDate: function (params) {
		this.$scope.res = "";
		console.log(params)
		if (params.status && params.data) {
			this.$scope.res = params;
		} else {
			tool.alert(params.msg)
		}
	},
	//发送参数来获取不同状态员工的数量
	GetNumber: function name() {
		var UserInfo = tool.getUserInfo();
		if (UserInfo) {
			var EmpCountObj = {
				shopId: UserInfo.shopId
			};
			this.service.SetEmpCountData(EmpCountObj);
		} else {
			tool.alert("您是否添加过此商铺")
		}
	},
	//获取各种状态的员工返回的数量
	GetEmpCountDate: function (backdata) {
		console.log(backdata);
		if (backdata.status) {
			this.$scope.BackNumber = backdata.data
		} else {
			tool.alert(backdata.msg)
		}

	}
};