
require('./router.js');
require('../public/lib/zepto.min.js');

var tool = require('../public/component/toollib.js');
var flag = localStorage.getItem("isRefresh");
// tool.go('#/enter_info', {shopName: "xxxx", isRefresh: true});
tool.go('#/login'); 
// tool.go('#/enter_map'); // enter_map enter_aptitude
tool.setView('full');
if(!flag) {
	localStorage.setItem("isRefresh", "true");
	window.location.href = "/index.html";
} else {
	setTimeout(function() {
		localStorage.setItem("isRefresh", "");
	}, 1000);
}