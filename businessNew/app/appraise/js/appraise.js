require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/appraise.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/appraise.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var moduleText = require('../view/appraise_module.html');

var AppraiseService = require('./appraiseService.js');

module.exports = {
	init: function ($el) {
		this.$el = $el || $(document.body);
		this.service = new AppraiseService(this);
		this.userInfo = tool.getUserInfo();
		this.currentItem = null;
		this.render();
		this.initVue();
		this.$scope.items = [];

		this.service.fetchComments({
			token: this.userInfo.token,
			sid: this.userInfo.shopId,
			page: 1,
			pagenumber: 999
		});

		this.service.fetchClassify({
			shopId: this.userInfo.shopId,
			token: this.userInfo.token
		});
	},
	render: function () {
		var $html = $(text);
		$html.find(".content").append(moduleText);
		this.$el.html($html);
	},
	initVue: function () {
		var self = this;
		this.$scope = {
			star: 0,
			state: 3,
			type: 0,
			types: [],
			isColor: 1,
			isShow: 0,
			listColor: 1,
			news: false,
			redactState: false,
			items: [],
			replyComments: ""
		};
		this.vue = new Vue({
			el: '.appraise_mian',
			data: this.$scope,
			methods: {
				aPactive: function (index, event) { self.aPactive(index, event) },
				goBack: function () { self.goBack() },
				redact: function (item) { self.redact(item) },
				hide: function () { self.hide() },
				send: function () { self.send() },
				starChange: function(value) { self.starChange(value) },
				stateChange: function(value) { self.stateChange(value) },
				typeChange: function(value) { self.typeChange(value) }
			}
		});
	},
	aPactive: function (index, event) {
		this.$scope.isColor = index; //修改数据 变色
		this.$scope.isShow = index; //进行菜单切换
		this.$scope.news = true;
	},
	starChange: function(value) {
		this.$scope.star = value;
		this.$scope.news = false;
		this.$scope.isShow = 0;
		this.querySearch();
	},
	stateChange: function(value) {
		this.$scope.state = value;
		this.$scope.news = false;
		this.$scope.isShow = 0;
		this.querySearch();
	},
	typeChange: function(value) {
		this.$scope.type = value;
		this.$scope.news = false;
		this.$scope.isShow = 0;
		this.querySearch();
	},
	querySearch: function() {
		var params = {
			token: this.userInfo.token,
			sid: this.userInfo.shopId,
			page: 1,
			pagenumber: 999
		}
		if(this.$scope.star != 0) {
			params.star = this.$scope.star;
		}
		if(this.$scope.state != 3) {
			params.status = this.$scope.state;
		}
		if(this.$scope.type != 0) {
			params.categoryCustomId = this.$scope.type;
		}
		this.service.fetchComments(params);
	},
	goBack: function () {
		tool.back();
	},
	redact: function (item) {
		this.$el.find('#re_text').focus();
		this.$scope.redactState = true;
		this.currentItem = item;
	},
	hide: function () {
		this.$scope.redactState = false;
	},
	send: function () {
		this.$scope.redactState = false;
		if(this.currentItem && this.$scope.replyComments != "") {
			this.service.replyComments({
				orderDetailId: this.currentItem.orderDetailId,
				reContent: this.$scope.replyComments
			});
			this.$scope.replyComments = "";
		} else {
			tool.alert("评论信息不能为空！");
		}
	},
	fetchCommentsCallback: function(result) {
		if(result.status) {
			if(result.data.ctnInfo) {
				this.$scope.items = result.data.ctnInfo;
			}
		} else {
			tool.alert(result.msg);
		}
	},
	fetchClassifyCallback: function(result) {
		if(result.status) {
			this.$scope.types = result.data;
		} else {
			tool.alert(result.msg);
		}
	},
	replyCommentsCallback: function(result) {
		if(result.status) {
			this.querySearch();
		} else {
			tool.alert(result.msg);
		}
	}
};