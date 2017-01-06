
var data = window.userdata || {};
data.zIndex = 0;
data.isForward = true;
if(!window.userdata) {
	window.userdata = data;
}
module.exports = {
	getParams: function() {
		var key = window.location.hash;
		return data[key].params;
	},
	setItem: function(key, value) {
		data[key] = value;
	},
	getItem: function(key) {
		return data[key];
	},
	getCount: function() {
		data.zIndex++;
		return data.zIndex;
	},
	setForword: function(val) {
		data.isForward = val;
	},
	getForword: function() {
		return data.isForward;
	},
	on: function(key, fun) {
		if(!data.events) {
			data.events = {};
		}
		data.events[key] = fun;
	},
	emit: function(key, params) {
		var evts = data.events;
		if(evts) {
			evts[key] && evts[key](params);
		}
	}
};