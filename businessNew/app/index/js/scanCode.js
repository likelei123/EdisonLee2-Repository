require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/scanCode.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/scanCode.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var ScanCodeService = require('./scanCodeService.js');

window.getZXingInfo = getZXingInfo;
function getZXingInfo(code) {
	scope.$scope.data.code = code;
}

var scope = null;
module.exports = scope = {
	init: function($el) {
		this.$el = $el || $(document.body);
		this.service = new ScanCodeService(this);
		this.params = $state.getParams();
		this.render();
		this.initVue();
		this.activeTab();
	},
	render: function() { 
		this.$el.html(text);
	},
	initVue: function() {
		var self = this;
		this.$scope = {
			state: {
				tabIndex: 1
			},
			data: {
				isNumber: this.params.type == "number" ? true : false,
				code: ""
			}
		};
		this.vue = new Vue({
			el: '.scan-code-box',
			data: this.$scope,
			methods: {
				onBack: function() { self.onBack() },
				onChange: function(isNumber) { self.onChange(isNumber) },
				onValidate: function() { self.onValidate() }
			}
		});
	},
	activeTab: function() {
		if(!this.$scope.data.isNumber) {
			//拉起android扫码插件 
			tool.openCode();
		}
	},
	onBack: function() {
		tool.back();
	},
	onChange: function(isNumber) {
		if(this.$scope.data.isNumber != isNumber) {
			this.$scope.data.isNumber = isNumber;
			this.activeTab();
		}
	},
	onValidate: function() {
		this.service.checkConsumeCode({
			appId: "xxxxx",
			consumeCode: this.$scope.data.code
		});
	},
	checkConsumeCodeCallback: function(result) {
		if(result.status) {
			result.data.isShowButton = true;
			tool.go('#/order/order_details', result.data);
		} else {
			tool.alert(result.msg);
		}
	}
};