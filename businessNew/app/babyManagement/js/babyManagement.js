require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/babyManagement.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/babyManagement.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

var modileText = require('../view/babyManagement_module.html');

var babyManagementService = require('./babyManagementService.js');
module.exports = {
	init: function ($el) {
		this.$el = $el || $(document.body);
		this.service = new babyManagementService(this);
		this.render();
		this.initVue();
		this.customTypeList();
		this.getGoodsEach();
		this.$scope.navSubmenu = [{
			navName: "添加时间",
			s1: false,
			s2: true
		}, {
			navName: "销量",
			s1: false,
			s2: false,
		}, {
			navName: "库存",
			s1: false,
			s2: false
		}];
		this.$scope.items = [];
		this.initializesValue(); //前页面获取值
	},
	render: function () {
		var $html = $(text);
		$html.find(".content").append(modileText);
		this.$el.html($html);
	},
	initVue: function () {
		var self = this;
		this.$scope = {
			items: [], //商品列表
			personnel: 1,
			menu: 1,
			menuList: false,
			check: false,
			off: '批量',
			batch: true,
			btnStatus: false, //判断按钮的状态
			skushow: false, //问题1  SKU没有数据 目前为隐藏
			navSubmenu: [], //时间列表
			allCheck: false,
			customList: [], //获取分类列表
			sort: [{
				name: 'timeSort',
				Value: 1
			}, {
				name: 'saleNumSort',
				Value: 0
			}, {
				name: 'stockSort',
				Value: 0
			}],
			sotrAffirm: [{
				name: 'timeSort',
				Value: 1
			}],
			typeValue: 1, //筛选类型值 默认为1
			categoryId: '', //商家分类ID
			shopID: '', //店铺ID
			token: '', //token值
			getGoodsEach: [{
				name: '在售',
				count: ''
			}, {
				name: '橱窗',
				count: ''
			}, {
				name: '仓库',
				count: ''
			}, {
				name: '审核中',
				count: ''
			}, ],
			currentIndex: 0, //递归参数
			currArray: [1, 2, 3, 4],
			imagesArray: ["../app/babyManagement/images/weishnehe.png", "../app/babyManagement/images/shenhe.png", "../app/babyManagement/images/weitongguo.png"]

		};
		this.vue = new Vue({
			el: '.baby_main',
			data: this.$scope,
			methods: {
				goBack: function () {
					self.goBack();
				},
				parActive: function (index) {
					self.parActive(index);
				},
				onEnter: function (url) {
					self.onEnter(url);
				},
				menus: function (index) {
					self.menus(index);
				},
				menuBtn: function () {
					self.menuBtn();
				},
				batchActive: function () {
					self.batchActive();
				},
				submenu: function (index) {
					self.submenu(index);
				},
				checkActive: function (index) {
					self.checkActive(index);
				},
				allCheckActive: function () {
					self.allCheckActive();
				},
				deleCommodity: function () { //删除商品
					self.deleCommodity();
				},
				setUpDwon: function () { //下架商品
					self.setUpDwon();
				},
				putaway: function () { //上架商品
					self.putaway();
				},
				skipRelease: function () {
						self.skipRelease();
					}
					// ,
					// SetRecommend: function (index) { //1 批量推送橱窗 0 批量移除推送
					// 	self.SetRecommend(index);
					// }
			}
		})
	},
	skipRelease: function () { //跳转到商品详情界面
		tool.go('#/babyRecomposeRelease', {
			isRefresh: true
		});
	},
	goBack: function () {
		tool.back();
	},
	onEnter: function (url) {
		tool.go(url);
	},
	menus: function (index) {
		var self = this;
		this.$scope.menu = index;
		this.$scope.categoryId = this.$scope.customList[index].id; //商家自分类ID
		this.service.getGoodsType({ //点击自分类请求
			shopId: self.$scope.shopID,
			type: this.$scope.typeValue,
			[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
			token: self.$scope.token,
			categoryId: this.$scope.categoryId
		});
	},
	menuBtn: function () {
		var self = this;
		this.$scope.menuList = !this.$scope.menuList;
		this.$scope.menu = 0;
		this.$scope.categoryId = this.$scope.customList[0].id; //商家自分类ID
		if (this.$scope.menuList) {
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				type: self.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
				token: self.$scope.token,
				categoryId: self.$scope.categoryId
			});
		} else { //关闭子分类选择 赋值为空 
			this.$scope.categoryId = '';
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				type: self.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
				token: self.$scope.token
			});
		};
	},
	batchActive: function () {
		this.$scope.check = !this.$scope.check;
		if (this.$scope.check) {
			this.$scope.off = '取消';
			this.$scope.menuList = false;
			this.$scope.batch = false;
			this.$scope.allCheck = false;
			this.$scope.btnStatus = false;
			for (var i in this.$scope.items) {
				this.$scope.items[i].checkStatus = false;
			};
		} else {
			this.$scope.off = '批量';
			this.$scope.batch = true;
			this.init();
		};
	},
	parActive: function (index) {
		var self = this;
		this.$scope.personnel = index;
		this.$scope.typeValue = index;
		if (this.$scope.menuList !== true) { //关闭子分类选择 赋值为空 
			this.$scope.categoryId = '';
		};
		if (this.$scope.categoryId == '') { //点击筛选类型 请求
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				type: this.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
				token: self.$scope.token
			});
		} else {
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				type: this.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
				token: self.$scope.token,
				categoryId: this.$scope.categoryId
			});
		}
	},
	changebabyManagementTypeCallback: function (result) { //获取商品列表
		var self = this;
		this.$scope.items = [];
		var itemsList = this.$scope.items;
		var imageSrcUrl = this.$scope.imagesArray;
		if (result.status && result.data) {
			$.each(result.data.merList, function (index, item) {
				itemsList.push({
					itemId: item.itemId, //商品ID
					merchandiseName: item.merchandiseName, //商品名称
					merchandiseLogo: item.merchandiseLogo, //商品LOGO
					createTime: item.createTime.substring(0, 10), //时间
					salesMonth: item.salesMonth, //月销量
					collections: item.collections, //收藏数
					onLinePrice: item.skuList[0].onLinePrice, //线上价
					linePrice: item.skuList[0].linePrice, //线下价钱
					totalQty: item.totalQty, //总的库存
					checkStatus: false, //选中效果
					auditStatus: item.auditStatus,
					imageSrc: ''
				});
			});
			$.each(itemsList, function (index, item) {
				if (item.auditStatus == 0) {
					item.imageSrc = imageSrcUrl[0];
				} else if (item.auditStatus == 1) {
					item.imageSrc = imageSrcUrl[1];
				} else if (item.auditStatus == 2) {
					item.imageSrc = imageSrcUrl[2];
				};
			});
		} else {
			tool.alert(result.data);
		};
	},
	submenu: function (index) {
		var self = this;
		var navSubmenu = this.$scope.navSubmenu;
		for (var i in navSubmenu) {
			if (i == index) {
				if (navSubmenu[i].s1) {
					navSubmenu[i].s1 = false;
					navSubmenu[i].s2 = true;
					if (i == 0) {
						self.$scope.sort[i].Value = 1; //时间排序值
					} else if (i == 1) {
						self.$scope.sort[i].Value = 1; //销量排序
					} else if (i == 2) {
						self.$scope.sort[i].Value = 1; //库存排序
					};
				} else {
					navSubmenu[i].s1 = true;
					navSubmenu[i].s2 = false;
					if (i == 0) {
						self.$scope.sort[i].Value = 0;
					} else if (i == 1) {
						self.$scope.sort[i].Value = 0;
					} else if (i == 2) {
						self.$scope.sort[i].Value = 0;
					};
				};
			} else {
				navSubmenu[i].s1 = false;
				navSubmenu[i].s2 = false;
			};
		};
		this.$scope.sotrAffirm = [];
		this.$scope.sotrAffirm.push(self.$scope.sort[index]);
		if (this.$scope.menuList !== true) {
			this.$scope.categoryId = '';
		}
		if (this.$scope.categoryId == '') { //点击排序请求
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				type: this.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
				token: self.$scope.token
			});
		} else {
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				type: this.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
				token: self.$scope.token,
				categoryId: this.$scope.categoryId
			});
		};

	},
	checkActive: function (index) {
		this.$scope.items[index].checkStatus = !this.$scope.items[index].checkStatus;
		var checkStatusArray = [];
		var itemVal = this.$scope.items;
		for (var i in itemVal) {
			if (itemVal[i].checkStatus) {
				checkStatusArray.push(1);
			} else {
				checkStatusArray.push(0);
			};
		};
		if (checkStatusArray.indexOf(1) > -1) {
			this.$scope.btnStatus = true;
		} else {
			this.$scope.btnStatus = false;
		};
		var clickStatus = [];
		$.each(this.$scope.items, function (index, item) {
			if (item.checkStatus) {
				clickStatus.push(1);
			} else {
				clickStatus.push(0);
			};
		});
		if (clickStatus.indexOf(0) == -1) {
			this.$scope.allCheck = true;
		} else {
			this.$scope.allCheck = false;
		};
	},
	allCheckActive: function () {
		this.$scope.allCheck = !this.$scope.allCheck;
		var allCheck = this.$scope.allCheck;
		var items = this.$scope.items;
		if (allCheck) {
			for (var i in items) {
				this.$scope.items[i].checkStatus = true;
				this.$scope.btnStatus = true;
			};
		} else {
			for (var i in items) {
				this.$scope.items[i].checkStatus = false;
				this.$scope.btnStatus = false;
			};
		};
	},
	deleCommodity: function () { //点击批量删除选中商品
		if (this.$scope.btnStatus) {
			var checkStatusArray = [];
			var itemVal = this.$scope.items;
			for (var i in itemVal) {
				if (itemVal[i].checkStatus) {
					checkStatusArray.push(itemVal[i].itemId);
				};
			};
			checkStatusArrayIfy = JSON.stringify(checkStatusArray);
			this.service.deleType({
				appId: this.$scope.typeValue,
				shopId: this.$scope.shopID,
				goodsIds: checkStatusArrayIfy,
				token: this.$scope.token
			});
		} else {
			tool.alert("请选择删除商品");
		};
	},
	changeDeleTypeCallback: function (result) {
		if (result.status && result.data) {
			tool.alert("删除失败");
		} else {
			tool.alert("删除成功");
			this.initializesValue();
			this.$scope.menuList = false;
		}
	},
	setUpDwon: function () { //点击批量下架选中商品
		if (this.$scope.btnStatus) {
			var checkStatusArray = [];
			var itemVal = this.$scope.items;
			for (var i in itemVal) {
				if (itemVal[i].checkStatus) {
					checkStatusArray.push(itemVal[i].itemId);
				};
			};
			checkStatusArrayIfy = JSON.stringify(checkStatusArray);
			this.service.setUpDwonType({
				appId: this.$scope.typeValue,
				shopId: this.$scope.shopID,
				goodsIds: checkStatusArrayIfy,
				token: this.$scope.token,
				status: 0
			});
		} else {
			tool.alert("请选择下架商品");
		};
	},
	changeSetUpDwonTypeCallback: function (result) {
		if (result.status && result.data) {
			tool.alert(result.data.msg);
		} else {
			this.initializesValue();
			this.$scope.menuList = false;
		}
	},
	putaway: function () { //点击批量下架选中商品
		if (this.$scope.btnStatus) {
			var checkStatusArray = [];
			var itemVal = this.$scope.items;
			for (var i in itemVal) {
				if (itemVal[i].checkStatus) {
					checkStatusArray.push(itemVal[i].itemId);
				};
			};
			checkStatusArrayIfy = JSON.stringify(checkStatusArray);
			this.service.setUpDwonType({
				appId: this.$scope.typeValue,
				shopId: this.$scope.shopID,
				goodsIds: checkStatusArrayIfy,
				token: this.$scope.token,
				status: 1
			});
		} else {
			tool.alert("请选择上架架商品");
		};
	},
	// SetRecommend: function (index) { //批量推送橱窗
	// 	if (this.$scope.btnStatus) {
	// 		var checkStatusArray = [];
	// 		var itemVal = this.$scope.items;
	// 		for (var i in itemVal) {
	// 			if (itemVal[i].checkStatus) {
	// 				checkStatusArray.push(itemVal[i].itemId);
	// 			}
	// 		};
	// 		var status = index;
	// 		checkStatusArrayIfy = JSON.stringify(checkStatusArray);
	// 		this.service.setRecommendType({
	// 			appId: this.$scope.typeValue,
	// 			shopId: this.$scope.shopID,
	// 			goodsIds: checkStatusArrayIfy,
	// 			status: status,
	// 			token: this.$scope.token
	// 		});
	// 	} else {
	// 		if (index == 1) {
	// 			tool.alert("请选择推送商品");
	// 		} else {
	// 			tool.alert("请选择移除推送商品");
	// 		}

	// 	};
	// },
	// changeSetRecommendTypeCallback: function (result) {
	// 	if (result.status && result.data) {
	// 		tool.alert("操作失败");
	// 	} else {
	// 		tool.alert("操作成功");
	// 		this.initializesValue();
	// 		this.$scope.menuList = false;
	// 	}
	// },
	customTypeList: function () {
		var userInfo = tool.getUserInfo();
		var shopId = userInfo.shopId;
		this.$scope.shopID = shopId;
		this.$scope.token = userInfo.token;
		this.service.customType(shopId);
	},
	changeCustomTypeCallback: function (result) { //获取分类列表
		var self = this;
		var myscope = this.$scope.customList;
		if (result.status && result.data) {;
			$.each(result.data, function (index, item) {
				myscope.push({
					id: item.categoryId,
					addname: item.categoryName
				});
			});
			self.$scope.categoryId = myscope[0].id;
		} else {
			tool.alert(result.msg);
		}
	},
	initializesValue: function () {
		var self = this;
		var activeIndex = [];
		activeIndex.push($state.getParams());
		if (activeIndex[0].activeIndex == undefined) {
			self.$scope.menu = '';
			self.$scope.menuList = false;
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				token: self.$scope.token,
				type: self.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value
			});
		} else {
			var value = $state.getParams().activeIndex;
			var categoryIdValue = $state.getParams().categoryId;
			self.$scope.categoryId = categoryIdValue;
			self.$scope.menu = value;
			self.$scope.menuList = true;
			this.service.getGoodsType({
				shopId: self.$scope.shopID,
				token: self.$scope.token,
				type: this.$scope.typeValue,
				[self.$scope.sotrAffirm[0].name]: self.$scope.sotrAffirm[0].Value,
				categoryId: this.$scope.categoryId
			});

		}
	},
	getGoodsEach: function () { //获取查询在售、橱窗、仓库、审核中商品的数量    使用递归方法循环请求
		if (this.$scope.currentIndex >= this.$scope.currArray.length) {
			return;
		};
		var queryType = this.$scope.currArray[this.$scope.currentIndex];
		this.service.getGoodsEachStatusNumType({
			shopId: this.$scope.shopID,
			queryType: queryType
		});

	},
	changegetGoodsEachStatusNumTypeCallback: function (result) {
		if (result.status && result.data) {
			this.$scope.getGoodsEach[this.$scope.currentIndex].count = result.data.count;
			this.$scope.currentIndex++;
			this.getGoodsEach();
		} else {
			currentIndex++;
			getImg();
		}
	}


}