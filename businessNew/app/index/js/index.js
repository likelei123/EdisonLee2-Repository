require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/index.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/index.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var IndexService = require('./indexService.js');
var stoptemplate = require('../view/stopTemplate.html');

module.exports = {
	init: function ($el) {
		this.$el = $el || $(document.body);
		this.service = new IndexService(this);
		this.userInfo = tool.getUserInfo();
		this.shopInfo = null;
		this.render();
		this.initVue();
		this.renderUserPermission();

		// this.service.fetchShopInfo(this.userInfo.shopId);
		this.service.fetchVolume({
			shopId: this.userInfo.shopId,
			createDateStart: this.getNowFormatDate(),
			createDateEnd: this.getNowFormatDate()
		});
	},
	render: function () {
		this.$el.html(text);
	},
	initVue: function () {
		var self = this;
		this.$scope = {
			state: {
				tabIndex: 1
			},
			data: {
				jobType: this.userInfo.job ? this.userInfo.job : "店长",
				shopName: "",
				shopType: "",
				shopLogUrl: "",
				price: "",
				pageView: "",
				num: "",
				shopStatus: 1,
				shopStatusTextInfo: "",
				middleMenu: [
					{
						id: "",
						moduleType: 4,
						disable: true,
						text: "发布宝贝",
						icon: "&#xe605;",
						url: "#/babyRelease",
						params: {isRefresh: true}
					},
					{
						id: "",
						moduleType: 5,
						disable: true,
						text: "宝贝管理",
						icon: "&#xe600;",
						url: "#/babyManagement",
						params: {}
					},
					{
						id: "",
						moduleType: 1,
						disable: true,
						text: "订单管理",
						icon: "&#xe603;",
						url: "#/order",
						params: {}
					},
					{
						id: "",
						moduleType: 2,
						disable: true,
						text: "评价管理",
						icon: "&#xe609;",
						url: "#/appraise",
						params: {}
					}
				],
				centerMenu: [
					{
						id: "",
						moduleType: 6,
						disable: true,
						text: "分类管理",
						icon: "&#xe606;",
						url: "#/category",
						params: {},
						colorClass: 'color_pink'
					},
					{
						id: "",
						moduleType: 7,
						disable: true,
						text: "退款管理",
						icon: "&#xe60a;",
						url: "#/reimburse",
						params: {},
						colorClass: 'color_yellow'
					},
					{
						id: "",
						moduleType: 8,
						disable: true,
						text: "公告管理",
						icon: "&#xe607;",
						url: "#/notice",
						params: {},
						colorClass: 'color_green'
					},
					{
						id: "",
						moduleType: 3,
						disable: true,
						text: "员工管理",
						icon: "&#xe60c;",
						url: "#/pers",
						params: {},
						colorClass: 'color_blue'
					},
					{
						id: "",
						moduleType: 9,
						disable: true,
						text: "地址管理",
						icon: "&#xe604;",
						url: "#/address",
						params: {},
						colorClass: 'color_mazarine'
					},
					{
						id: "",
						moduleType: 10,
						disable: true,
						text: "配送管理",
						icon: "&#xe60d;",
						url: "",
						params: {},
						colorClass: 'color_purple'
					},
				]
			},
			backmydata:{},
			powerlist:{}
		};
		this.vue = new Vue({
			el: '.index_mian',
			data: this.$scope,
			methods: {
				onEnter: function (url, ops) {
					self.onEnter(url, ops)
				},
				changeTab: function (index) {
					self.changeTab(index)
				},
				onExit: function () {
					self.onExit()
				},
				onScanCode: function (event, type) {
					self.onScanCode(event, type)
				},
				stopBusiness: function() {
					self.stopBusiness();
				}
			},

		});
	},
	renderUserPermission: function() {
		// this.userInfo.shopInfo.status = 4;
		this.$scope.data.shopName = this.userInfo.shopInfo.shopName;
		this.$scope.data.shopType = this.userInfo.shopInfo.parentName;
		this.$scope.data.shopLogUrl = this.userInfo.shopInfo.shopLogo;
		this.$scope.data.shopStatus = this.userInfo.shopInfo.status;
		
		if(this.userInfo.shopInfo.status == '1') { //审核通过
			//请求用户角色， 赋予相应的权限
			this.$scope.data.shopStatus += (''+this.userInfo.shopInfo.boStatus);
			console.log('========================'+this.$scope.data.shopStatus);
			if(this.$scope.data.shopStatus == '11') { //审核通过
				this.$scope.data.shopStatusTextInfo = "";
			} else if(this.$scope.data.shopStatus == '10') { //店铺关闭
				this.$scope.data.shopStatusTextInfo = "店铺关闭中";
			} else if(this.$scope.data.shopStatus == '13') { //店铺停业
				this.$scope.data.shopStatusTextInfo = "店铺被平台停业中";
			}
		} else if(this.userInfo.shopInfo.status == '2') { //审核中
			this.$scope.data.shopStatusTextInfo = "店铺审核中";
		} else if(this.userInfo.shopInfo.status == '4') { //审核失败
			this.$scope.data.shopStatusTextInfo = "店铺信息审核失败";
		} else if(this.userInfo.shopInfo.status == '0') {
			this.$scope.data.shopStatusTextInfo = "店铺状态未审核";
		} else if(this.userInfo.shopInfo.status == '3') {
			this.$scope.data.shopStatusTextInfo = "店铺状态删除状态";
		}


		// $.each(this.$scope.data.middleMenu, function(index, item) {
		// 	item.disable = true;
		// });
		// $.each(this.$scope.data.centerMenu, function(index, item) {
		// 	item.disable = true;
		// });
		if (this.userInfo.account) {
			var myobj = {
				token: this.userInfo.token,
				cellphone: this.userInfo.account
			};
			this.service.fetchPermission(myobj);
		} else {
			tool.alert("该用户在系统中不存在！")
		}
	},
	renderItem: function() {
		var self = this;
		var list = this.$scope.data.middleMenu;
		var $el = this.$el.find('div[xtype="middle"]');
		$el.html('');
		$.each(list, function(index, item) {
			var el = $('<div class="del_fy del_fy_width" ><span class="icon '+(item.disable ? 'index_disable_gray' : 'color_gray' )+'">'+item.icon+'</span><p class="'+(item.disable ? 'index_disable_gray' : '' )+'">'+item.text+'</p></div>');
			if(!item.disable) {
				el.on('click', function() {
					self.onEnter(item.url, item.params);
				});
			}
			$el.append(el);
		});
		list = this.$scope.data.centerMenu;
		$el = this.$el.find('.classify');
		$.each(list, function(index, item) {
			var el = $('<div><p><span class="'+(item.disable ? 'index_disable_gray' : item.colorClass)+'">'+item.icon+'</span></p><p class="'+(item.disable ? 'index_disable_gray' : item.colorClass)+'" >'+item.text+'</p></div>');
			if(!item.disable) {
				el.on('click', function() {
					self.onEnter(item.url, item.params);
				});
			}
			$el.append(el);
		});
	},
	onEnter: function (url, ops) {
		if(url) { 
			tool.go(url, ops);
		} 
	},
	changeTab: function (index) {
		this.$scope.state.tabIndex = index;
		if(index == 3) {
			this.$scope.state.tabIndex = 1;
			tool.openAndroidInfo();
		}
	},
	onExit: function () {
		localStorage.clear();
		sessionStorage.clear();
		tool.go('#/login');
	},
	onScanCode: function (event, type) {
		var params = {
			type: type
		}
		tool.go('#/index/scancode', params);
	},
	stopBusiness: function() {
		var self = this;
		var $panel =  $(stoptemplate);
		this.$el.find(".index_mian").append($panel);
		$panel.find('.i-left-btn').on('click', function() {
			$panel.remove();
		});
		$panel.find('.i-right-btn').on('click', function() {
			var day = $panel.find('input[type="number"]').val();
			self.stopActive(day);
			$panel.remove();
		});
	},
	stopActive: function(day) {
		if(day) {
			this.service.stopShop({
				token: this.userInfo.token,
				days: day,
				shopClosingReason: "xxxx"
			});
		} else {
			tool.alert('请填写有效的天数！');
		}
	},
	closeStopPanel: function() {
		this.$stopPanel.remove();
		this.$stopPanel = null;
	},
	getNowFormatDate: function () {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = year + seperator1 + month + seperator1 + strDate
		return currentdate;
	},
	fetchShopInfoCallback: function (result) {
		if (result.status) {
			this.shopInfo = result.data;
			this.$scope.data.shopName = result.data.shopName;
			this.$scope.data.shopType = result.data.parentName;
			this.$scope.data.shopLogUrl = result.data.shopLogo
		} else {
			tool.alert(result.msg);
		}
	},
	fetchVolumeCallback: function (result) {
		if (result.status) {
			this.$scope.data.pageView = result.data.pageView;
			this.$scope.data.price = result.data.price;
			this.$scope.data.num = result.data.num;
		} else {
			tool.alert(result.msg);
		}
	},
	fetchPermissionCallback: function (result) {
		if (result.status) {
			var self = this;
			this.$scope.data.jobType = result.data.empJob;
			// this.$scope.data.shopLogUrl = result.data.empImgs;
			this.$scope.backmydata = result.data;
			this.$scope.powerlist = result.data.shopModel;
			if(result.data.shopModel && result.data.shopModel.length > 0) {
				$.each(result.data.shopModel, function(index, item) {
					$.each(self.$scope.data.middleMenu, function(m_index, m_item) {
						if(item.moduleType == m_item.moduleType) {
							if(item.ifShow == 1) {
								m_item.disable = false;
							} else {
								m_item.disable = true;
							}
						}
					});
					$.each(self.$scope.data.centerMenu, function(c_index, c_item) {
						if(item.moduleType == c_item.moduleType) {
							if(item.ifShow == 1) {
								c_item.disable = false;
							} else {
								c_item.disable = true;
							}
						}
					});
				});
				console.log(JSON.stringify(self.$scope.data.middleMenu));
			}
			// $.each(self.$scope.data.middleMenu, function(m_index, m_item) {
			// 			m_item.disable = false;
			// });
			// $.each(self.$scope.data.centerMenu, function(c_index, c_item) {
			// 			c_item.disable = false;
			// });
			this.renderItem();
		} else {
			tool.alert(result.msg)
		}
	},
	stopShopCallback: function(result) {
		console.log(result);
	}
};