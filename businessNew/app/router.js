require('!style!css!sass!../public/scss/global.scss');
var Router = require('../public/lib/director.js');
var $state = require('../public/component/$state.js');
var tool = require('../public/component/toollib.js');

var $next_box = null, //当前盒子
	$current_box = null, //下一个盒子
	isFirst = true, //是否第一次进入
	isAnimate = true; //是否开启动画

var routers = {
	"/login": function () {
		require(['./login/js/login.js'], loadInstance(false));
	},
	"/login/forgetpassword": function () {
		require(['./login/js/forgetPassword.js'], loadInstance(true));
	},
	"/register": function () {
		require(['./register/js/register.js'], loadInstance(true));
	},
	"/index": function () {
		require(['./index/js/index.js'], loadInstance(true));
	},
	"/index/shop_info": function () {
		require(['./index/js/shopInfo.js'], loadInstance(true));
	},
	"/index/scancode": function () {
		require(['./index/js/scanCode.js'], loadInstance(true));
	},
	"/index/shop_qualifi": function () {
		require(['./index/js/shop_qualifi.js'], loadInstance(false));
	},
	"/index/password_manage": function () {
		require(["./index/js/password_manage.js"], loadInstance(false))
	},
	"/pers": function () {
		require(['./personnel/js/personnel.js'], loadInstance(true));
	},
	"/add": function () {
		require(['./personnel/js/add.js'], loadInstance(true));
	},
	"/compile": function () {
		require(['./personnel/js/compile.js'], loadInstance(true));
	},
	"/pow": function () {
		require(['./personnel/js/power.js'], loadInstance(true));
	},
	"/particulars": function () {
		require(['./personnel/js/particulars.js'], loadInstance(true));
	},
	"/particulars_leave": function () {
		require(['./personnel/js/particulars_leave.js'], loadInstance(false));
	},
	"/appraise": function () {
		require(['./appraise/js/appraise.js'], loadInstance(true));
	},
	"/babyRecomposeDetails": function () {
		require(['./babyManagement/js/pageDetails/babyRecomposeDetails.js'], loadInstance(true));
	},
	"/babyRecomposeProperty": function () {
		require(['./babyManagement/js/pageDetails/babyRecomposeProperty.js'], loadInstance(true));
	},
	"/babyRecomposeRelease": function () {
		require(['./babyManagement/js/pageDetails/babyRecomposeRelease.js'], loadInstance(true));
	},
	"/babyRecomposeSelect": function () {
		require(['./babyManagement/js/pageDetails/babyRecomposeSelect.js'], loadInstance(true));
	},
	"/babyRecomposeStandard": function () {
		require(['./babyManagement/js/pageDetails/babyRecomposeStandard.js'], loadInstance(true));
	},
	"/imgRecomposeSwitcher": function () {
		require(['./babyManagement/js/pageDetails/imgRecomposeSwitcher.js'], loadInstance(true));
	},
	"/previewRecompose": function () {
		require(['./babyManagement/js/pageDetails/previewRecompose.js'], loadInstance(true));
	},
	"/purchaseRecomposeText": function () {
		require(['./babyManagement/js/pageDetails/purchaseRecomposeText.js'], loadInstance(true));
	},
	"/storeRecomposeClass": function () {
		require(['./babyManagement/js/pageDetails/storeRecomposeClass.js'], loadInstance(true));
	},
	"/babyManagement": function () {
		require(['./babyManagement/js/babyManagement.js'], loadInstance(true));
	},
	"/babyRelease": function () {
		require(['./babyRelease/js/babyRelease.js'], loadInstance(true));
	},
	"/preview": function () {
		require(['./babyRelease/js/preview.js'], loadInstance(true));
	},
	"/babySelect": function () {
		require(['./babyRelease/js/babySelect.js'], loadInstance(true));
	},
	"/babyProperty": function () {
		require(['./babyRelease/js/babyProperty.js'], loadInstance(true));
	},
	"/babyDetails": function () {
		require(['./babyRelease/js/babyDetails.js'], loadInstance(true));
	},
	"/babyStandard": function () {
		require(['./babyRelease/js/babyStandard.js'], loadInstance(true));
	},
	"/imgSwitcher": function () {
		require(['./babyRelease/js/imgSwitcher.js'], loadInstance(true));
	},
	"/purchaseText": function () {
		require(['./babyRelease/js/purchaseText.js'], loadInstance(true));
	},
	"/storeClass": function () {
		require(['./babyRelease/js/storeClass.js'], loadInstance(true));
	},
	"/search": function () {
		require(['./babyManagement/js/search.js'], loadInstance(false));
	},
	"/order": function () {
		require(['./order/js/order_manage.js'], loadInstance(true));
	},
	"/order/order_details": function () {
		require(['./order/js/order_details.js'], loadInstance(true));
	},
	"/address": function () {
		require(['./address/js/address_index.js'], loadInstance(true));
	},
	"/address_details": function () {
		require(["./address/js/address_details"], loadInstance(true))
	},
	'/enter_list': function () {
		require(['./enter/js/enter_list'], loadInstance(true));
	},
	"/enter_map": function () {
		require(['./enter/js/enter_map'], loadInstance(false));
	},
	"/enter_city": function () {
		require(['./enter/js/enter_city'], loadInstance(false));
	},
	"/enter_info": function () {
		require(["./enter/js/enter_info"], loadInstance(true));
	},
	"/enter_aptitude": function () {
		require(["./enter/js/enter_aptitude"], loadInstance(true));
	},
	"/enter_agreement": function () {
		require(["./enter/js/enter_agreement"], loadInstance(false))
	},
	"/enter_trade": function () {
		require(["./enter/js/enter_trade"], loadInstance(true))
	},
	"/category": function () {
		require(["./category/js/category_manage"], loadInstance(false))
	},
	"/notice": function () {
		require(["./notice/js/notice_index"], loadInstance(false))
	},
	"/reimburse": function () {
		require(["./reimburseAndSale/js/reimburseAndSale"], loadInstance(true))
	},
	"/dealRefund": function () {
		require(["./reimburseAndSale/js/dealRefund"], loadInstance(true))
	},
	"/refundOperation": function () {
		require(["./reimburseAndSale/js/refundOperation"], loadInstance(true))
	},
	"/wallet": function () {
		require(["./wallet/js/wallet_index"], loadInstance(true))
	},
	"/wallet/balance-payments": function () {
		require(["./wallet/js/balance_payments"], loadInstance(true))
	},
	"/wallet/order-water": function () {
		require(["./wallet/js/order_water"], loadInstance(true))
	},
	"/wallet/withdrawal": function () {
		require(["./wallet/js/withdrawal"], loadInstance(true))
	},
	"/addBank": function () {
		require(["./wallet/js/addBank"], loadInstance(true))
	},
	"/bankMessage": function () {
		require(["./wallet/js/bankMessage"], loadInstance(true))
	},

};


function loadInstance(isRefresh, isLoading) {
	return function (instance) {
		if (!instance.init.isFirstRun) {
			instance.init.isFirstRun = true;
			instance.init($next_box);
		} else if (isRefresh) {
			instance.init($next_box);
		}
		$current_box = $next_box;
	}
}

var router = new Router.Router(routers);
router.configure({
	before: function () {
		var width = $(window).width();
		var key = window.location.hash;
		var obj = $state.getItem(key);
		var isForward = $state.getForword();

		if (!obj) {
			window.location.href = "/index.html";
		} else if (!obj.element) {
			var $el = $next_box = tool.creatBox(isFirst);
			tool.loading($next_box);
			obj.element = $el;
		} else if (obj.element) {
			$next_box = obj.element;
			$current_box.removeClass('active-box-animate');
			$next_box.removeClass('active-box-animate');
			$current_box.css('transform', "translateX(0px)");

			if (isForward) {
				$next_box.css('transform', "translateX(" + width + "px)");

				$current_box.css('zIndex', $state.getCount());
				$next_box.css('zIndex', $state.getCount());
			} else {
				$next_box.css('transform', "translateX(-200px)");

				$next_box.css('zIndex', $state.getCount());
				$current_box.css('zIndex', $state.getCount());
			}
		}
		//判断当前盒子和下一个盒子执行动画
		if ($current_box && $next_box) {
			if (isAnimate) {
				if (isForward) {
					tool.animate($current_box, $next_box, "next");
				} else {
					tool.animate($current_box, $next_box, "back");
				}
				setTimeout(function () {
					$current_box = $next_box;
				}, 420);
			} else {
				$next_box.css('zIndex', $state.getCount());
				$next_box.css('transform', "translateX(0px)");
				$current_box = $next_box;
			}

		}
		isFirst = false;
	}
});
router.init();