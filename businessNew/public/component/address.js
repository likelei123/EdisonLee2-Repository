
require('!style!css!sass!../scss/address.scss');
require('../lib/zepto.min.js');
var Vue = require('../lib/vue.js');
var data = require('./region.js');

module.exports = Vue.extend({
	template: "<div class='address-cpt-box'>"+
			  	"<header class='title-bar'>"+
			  		"<div class='ensure-button' v-on:click='ensure()'>确定</div>"+
			  		"<div class='cancel-button' v-on:click='hide()'>取消</div>"+
			  	"</header>"+
			  	"<div class='scroll-flexbox'>"+
			  		"<div class='down-level-box'>"+
			  			"<div type='province' class='item-box'>"+
			  				"<div class='cell' index='{{ $index }}' v-for='item in data.provinces'>{{ item.name }}</div>"+
			  			"</div>"+
			  			"<div type='city' class='item-box'>"+
			  				"<div class='cell' index='{{ $index }}' v-for='item in data.citys'>{{ item.name }}</div>"+
			  			"</div>"+
			  			"<div type='region' class='item-box'>"+
			  				"<div class='cell' index='{{ $index }}' v-for='item in data.regions'>{{ item.DisName }}</div>"+
			  			"</div>"+
			  		"</div>"+
			  		"<div class='up-level-box'>"+
			  			"<div class='scroll-mask' xtype='province' v-on:touchstart='start($event, 1)' v-on:touchend='stop($event, 1)'></div>"+
			  			"<div class='scroll-mask' xtype='city' v-on:touchstart='start($event, 2)' v-on:touchend='stop($event, 2)'></div>"+
			  			"<div class='scroll-mask' xtype='region' v-on:touchstart='start($event, 3)' v-on:touchend='stop($event, 3)'></div>"+
			  		"</div>"+
			  	"</div>"+
			  "</div>",
	data: function() {
		return {
			state: {
				type: 1,                // 1省  2市  3区
				timer: null,            //当前计时器句柄
				topY: 0,                //触摸点的Y坐标
				stepValue: 0,           //move事件每一步触发的移动速率
				stepArray: [],          //保存一个周期touchmove事件产生的stepValue值 
				dx: 40,                 //细分值  
				topMax: 90,      		//最大值
				topMin: 0,              //最小值
				currentY01: 90,
				currentY02: 90,
				currentY03: 90
			},
			data: {
				provinces: [],
				citys: [],
				regions: []
			}
		};
	},
	ready: function() {
		var province = $(this.$el).find('div[type=province]');
		var city = $(this.$el).find('div[type=city]');
		var region = $(this.$el).find('div[type=region]');
		province.css("transform", "translate3d(0px, "+this.$data.state.topMax+"px, 0px)");
		city.css("transform", "translate3d(0px, "+this.$data.state.topMax+"px, 0px)");
		region.css("transform", "translate3d(0px, "+this.$data.state.topMax+"px, 0px)");

		var self = this;
		this.data.provinces = data.provinces;
		this.data.citys = [];
		this.data.regions = [];

		var temp = data.provinces[0];
		$.each(data.citys, function(index, item) {
			if(item.ProID == temp.ProID) {
				self.data.citys.push(item);
			}
		});

		temp = this.$data.data.citys[0];
		$.each(data.regions, function(index, item) {
			if(item.CityID == temp.CityID) {
				self.data.regions.push(item);
			}
		});
	},
	events: {
		'address-show': function() {
			var $el = $(this.$el);
			var lightbox = $('<div class="address-cpt-light-box"></div>');
			$el.parent().append(lightbox);
			$el.css('transform', 'translate3d(0px, 0px, 0px)');
		}
	},
	methods: {
		_scrollY:function($el, y) {
			$el.css('transform', 'translate3d(0px, '+y+'px, 0px)');
		},
		_setMinMax: function() {

		},
		hide: function() {
			$(this.$el).css('transform', 'translate3d(0px, 250px, 0px)');
			$(this.$el).parent().find('.address-cpt-light-box').remove();
		},
		ensure: function() {

			var list = [];
			var data = this.$data.data;
			var state = this.$data.state;
			var height = state['currentY01']/30;
			var index = Math.abs(Math.round(height)-3);
			list.push(data.provinces[index]);

			height = state['currentY02']/30;
			index = Math.abs(Math.round(height)-3);
			list.push(data.citys[index]);

			height = state['currentY03']/30;
			index = Math.abs(Math.round(height)-3);
			list.push(data.regions[index]);

			this.hide();
			this.$dispatch('address-getValue', list);
		},
		start: function(e, type) {
			var state = this.$data.state;
			state.stepArray.splice(0, state.stepArray.length);
			state.topY = e.changedTouches[0].pageY;
			$(this.$el).on('touchmove', this.move);

			var data = null;
			state.type = type;
			if(type == 1) {
				data = this.$data.data.provinces;
			} else if (type == 2) {
				data = this.$data.data.citys;
			} else if (type == 3) {
				data = this.$data.data.regions;
			}
			state.topMin = -((data.length-4) * 30);
			// state.topMin = -900
			if($.isNumeric(state.timer)) {
				clearInterval(state.timer);
			}
		},
		move: function(e) {
			var state = this.$data.state;
			var $el = null; 
			if(1 == state.type) {
				$el = $(this.$el).find('div[type=province]');
			} else if (2 == state.type) {
				$el = $(this.$el).find('div[type=city]');
			} else if (3 == state.type) {
				$el = $(this.$el).find('div[type=region]');
			}

			var topY = e.changedTouches[0].pageY;
			state.stepVlue = topY-state.topY;

			if(state.stepVlue != 0) {
				state.stepArray.push({
					time: new Date().getTime(),
					value:state.stepVlue
				});
			}
			state.topY = topY;

			var temp = state['currentY0'+state.type] + state.stepVlue;
			if(temp >= state.topMax) {
				state['currentY0'+state.type] = state.topMax;
			} else if (temp <= state.topMin) {
				state['currentY0'+state.type] = state.topMin;
			} else {
				state['currentY0'+state.type] += state.stepVlue;
			}
			
			this._scrollY($el, state['currentY0'+state.type]);
		},
		stop: function(e, type) {
			
			var self = this;
			var $el = $(this.$el);
			var state = this.$data.state;
			var time = new Date().getTime();
			var len = state.stepArray.length;

			var value = 0;
			if(state.stepArray.length <= 0) {
				return ;
			}
			else if(time - state.stepArray[len-1].time < 30) {
				state['currentY0'+type] = Math.round(state['currentY0'+type] / 30)*30;
				value = this._calculateScrollValue();
			} else {
				value = Math.round(state['currentY0'+type] / 30)*30 - state['currentY0'+type];
			}
			

			if(state['currentY0'+type]+value >= state.topMax) {
				value = state.topMax - state['currentY0'+type];
			} else if (state['currentY0'+type]+value <= state.topMin) {
				value = state.topMin - state['currentY0'+type];
			}

			this._testAnimate(value, 15, function() {

				$el.unbind('touchmove', self.move);
			});
		},
		_calculateScrollValue: function() {
			var sum = 0;
			var state = this.$data.state;
			var tempValue = 0, len = state.stepArray.length || 1;

			$.each(state.stepArray, function(key, item) {
				tempValue += item.value;
			});
			tempValue = tempValue / len;
			var step = tempValue / state.dx;

			for(var i = 0 ; i < state.dx ; i++) {
				sum += (tempValue-step*(i+1));
			}
			return Math.round(sum / 30) * 30;
		},
		_animate: function(endY, time, callback) {
			var self = this;
			var state = this.$data.state;
			var $el = $(this.$el).find('div[type=province]');

			var tempValue = 0, len = state.stepArray.length || 1;
			$.each(state.stepArray, function(key, item) {
				tempValue += item.value;
			});

			tempValue = tempValue / len;
			
			var step = tempValue / state.dx;
			var index = 0;

			state.timer = setInterval(function() {
				index++;
				state.currentY01 += (tempValue-step*index);
				self._scrollY($el, state.currentY01);

				if(index >= state.dx) {
					clearInterval(state.timer);
					callback && callback();
				}

			}, time);
		},
		_testAnimate: function(value, time, callback) {

			var index = 0;
			var self = this;
			var state = this.$data.state;
			var initialValue = state['currentY0'+state.type];

			var $el = null; 
			if(1 == state.type) {
				$el = $(this.$el).find('div[type=province]');
			} else if (2 == state.type) {
				$el = $(this.$el).find('div[type=city]');
			} else if (3 == state.type) {
				$el = $(this.$el).find('div[type=region]');
			}

			state.timer = setInterval(function() {
				index++;
				var topY = (function(t,b,c,d){
					return -c *(t/=d)*(t-2) + b;
				})(index, initialValue, value, state.dx);

				state['currentY0'+state.type] = topY;
				self._scrollY($el, state['currentY0'+state.type]);
				if(index > state.dx) {
					clearInterval(state.timer);
					var height = state['currentY0'+state.type]/30;
					var count = Math.abs(Math.round(height)-3);
					var result = self.$data.data;
					if(state.type == 1) {
						var item = result.provinces[count];
						var ProID = item.ProID;
						var arrList = [];

						// result.citys.splice(0, result.citys.length);
						$.each(data.citys, function(index, item) {
							if(ProID == item.ProID) {
								arrList.push(item);
							}
						});
						result.citys = arrList;

						arrList = [];
						$.each(data.regions, function(index, item) {
							if(result.citys[0].CityID == item.CityID) {
								arrList.push(item);
							}
						})
						result.regions = arrList;
						state['currentY02'] = 90;
						state['currentY03'] = 90;
						$(self.$el).find('div[type=city]').css('transform', 'translate3d(0px, 90px, 0px)');
						$(self.$el).find('div[type=region]').css('transform', 'translate3d(0px, 90px, 0px)');

					} else if(state.type == 2) {
						var item = result.citys[count];
						var CityID = item.CityID;
						var arrList = [];
						$.each(data.regions, function(index, item) {
							if(CityID == item.CityID) {
								arrList.push(item);
							}
						});
						result.regions = arrList;
						state['currentY03'] = 90;
						$(self.$el).find('div[type=region]').css('transform', 'translate3d(0px, 90px, 0px)');
					}
					callback && callback();
				}
			}, time);
		}
	}
});