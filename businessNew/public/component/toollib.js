
require('../lib/zepto.min.js');
var $state = require('./$state.js');
var config = require('./config.js');
var width = $(window).width();
var loadText = require('./../template/load.html');

var scope = null;
module.exports = scope = {
	go: function(url, param) {
		$state.setForword(true);
		var btn = $('<a href="'+url+'" style="display:none"></a>');
		$(document.body).append(btn);
		btn.get(0).click();
		var key = window.location.hash;
		var obj = $state.getItem(key);
		if(obj) {
			obj.params = param;
		} else {
			$state.setItem(key, {
				params: param
			});
		}
		btn.remove();
	},
	back: function() { 
		var step = new Date().getTime();
		$state.setForword(false);
		window.history.back();
	},
	creatBox: function(isFirst) {
		var zindex = $state.getCount();
		var $el = $('<div class="active-box"></div>');
		$el.css({
			'zIndex': zindex 
			// 'width': width,
		}); 
		if(!isFirst) {
			$el.css('transform', 'translateX('+width+'px)');
		}
		$(document.body).append($el);
		return $el;
	},
	animate: function(current_box, next_box, direction) {
		setTimeout(function() { 
			current_box.addClass('active-box-animate');
			next_box.addClass('active-box-animate');
			setTimeout(function() {
				if(direction == "next") {
					current_box.css("transform", "translateX(-200px)");
					next_box.css("transform", "translateX(0px)");
				}
				else if (direction == "back") {
					current_box.css("transform", "translateX("+width+"px)");
					next_box.css("transform", "translateX(0px)");
				}
			}, 20);
		}, 20); 
	},
	//full 全屏
	setView: function(type) {
		if(type == "full") {
			type = 4;
		} else if (type == "half") {
			type = 2;
		}
		var $button = $('<a style="display:none;" href="uniwebview://WebViewSize?num='+type+'"></a>');
		$(document.body).append($button);
		$button.trigger('click');
		$button.remove();
	},
	setInitAndroidInfo: function(data) {
		var $button = $("<a style='display:none;' href='uniwebview://user?data="+JSON.stringify(data)+"'></a>");
		$(document.body).append($button);
		$button.trigger('click');
		$button.remove();
	},
	openAndroidInfo: function() {
		var $button = $("<a href='native://chatSession?data='></a>");
		$(document.body).append($button);
		$button.trigger('click');
		$button.remove();
	},
	setUserInfo: function(user) {
		var user = JSON.stringify(user);
		sessionStorage.setItem('user-info', user);
	},
	getUserInfo: function() {
		var user = sessionStorage.getItem('user-info');
		return JSON.parse(user);
	},
	loading: function($el) {
		$el.append(loadText);
	},
	unloading: function($el) {
		$el.parent().find('.spinner').remove();
	},
	alert: function(msg, time) {
		var time = time || 1000;
		var $el = $('<div class="alert-light-box"><div class="msg-box">'+msg+'</div><div class="bg-box">'+msg+'</div></div>');
		$(document.body).append($el);
		var msg = $el.find('.msg-box');
		var bg = $el.find('.bg-box');
		var leftValue = ($el.width() - msg.width()) / 2;
		msg.css('left', leftValue+'px');
		bg.css('left', leftValue+'px');

		setTimeout(function() {
			setTimeout(function() {
				$el.remove();
				$el = null;
			}, 400);
			$el.css('opacity', 0);
		}, time);
	},
	load3dShop: function(ops) {
        var result = {
            cityID: '0280',
            lat: ""+ops.lat,
            lng: ""+ops.lng,
            callback: ops.callback
        };
        var $el = $("<a style='display:none;' href='uniwebview://location?data="+JSON.stringify(result)+"'></a>");
        $(document.body).append($el);
        // $el.attr('href', 'uniwebview://location?data='+JSON.stringify(result));
        $el.trigger('click');
        $el.remove();
	},
	//加载图片插件
	loadImgPlugin: function(ops) {
		var result = {
            returnfunction: ops.callbackName,
            photoCount: ''+ops.number
        };
        //native://photo?data={"returnfunction": "set_phone","photoCount":1}
        var $el = $("<a style='display:none;' href='native://location?data="+JSON.stringify(result)+"'></a>");
        $(document.body).append($el);
        $el.trigger('click');
        $el.remove();
	},
	openCode: function() {
	    var _html = $('<a id="WebViewSizeAnk" style="display:none;" href="native://zxing?data="></a>');
	    $(document.body).append(_html);
	    _html.trigger('click');
	    _html.remove();
	},
	dataURItoBlob: function(dataURI) {
	    // convert base64/URLEncoded data component to raw binary data held in a string
	    var byteString;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
	        byteString = atob(dataURI.split(',')[1]);
	    else
	        byteString = unescape(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    // write the bytes of the string to a typed array
	    var ia = new Uint8Array(byteString.length);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }

	    return new Blob([ia], { type: mimeString });
	},
	imgFileUploads: function (ops, success, error) {
        var formData = new FormData();
        for (var x = 0; x < ops.length; x++) {
            var file = this.dataURItoBlob('data:image/jpg;base64,' + ops[x].imgBase64);
            formData.append('img' + x, file, x+ops[x].type);
        }
        var token = this.getUserInfo().token;
        // var token = 'faace92acb321ca89fd655b1c2cfa70c2850c1ac';
        $.ajax({
            type: 'POST',
            url: config.service.server+'/JHUpload/QingCloud/putFile?token=' + token,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status) {
                	var urls = [];
                    for(var key in response.data) {
                    	urls.push(response.data[key].url);
                    }
                    success(urls);
                } else {
                	scope.alert(response.msg);
                }
            },
            error: function (response) {
                error && error(response);
            }
        });
    },
	/*
    *paramter
    * $btn 按钮的zepto对象
    * time 发送之后好多秒内按钮不能点击必填 一般是10
    * $input 获取电话号码的文本框的zepto对象
    * callback 发送验证码接口的回调函数 可不填
		state  0表示发送注册短信的接口 1表示忘记密码或修改密码的接口

    **/
    PhoneValidateCodeButton: function(state,$btn, time, $input, callback) {
        var $el = $btn;
        var _time = time;
        var isEnable = true;
        var timeHandle;
		var Url;
		if(state==0){
			Url="/user/Register/sendRegisterCode";
		}else if(state==1){
			Url="/user/user/sendRePasswordCode";
		};
        
        this._initliaze = function() {
            var self = this;
            $el.on('click', function() {
                if(/^1[34578]\d{9}$/.test($input.val())) {
                    self._addClick();    
                } else {
                    scope.alert('手机号格式不正确！');
                }
            });
        };

        this._addClick = function() {
            if(isEnable) {
                _time = time;
                this._server();
                this._runtime();
                this._disabledCss();
            }
        };

        this._runtime = function() {
            isEnable = !isEnable;
            $el.text('('+_time+')秒后获取');
            var self = this;
            timeHandle = setInterval(function() {
                _time--;
                $el.text('('+_time+')秒后获取');
                if(_time <= -1) {
                    clearInterval(timeHandle);
                    isEnable = !isEnable;
                    self._enableCss();
                }
            }, 1000);
        };

        this._server = function() {
            $.ajax({
                type: 'GET',
                url: config.service.server+Url,
                dataType: 'json',
                data: {
                    phoneNum : $input.val()
                },
                success:function(result) {
                    callback && callback(result);
                },
                error: function(e) {
                    console.error(e);
                }
            });
        };

        //禁用样式
        this._disabledCss = function() {
            $el.css('backgroundColor', '#d2d2d2');
            $el.css('color', 'white');
        };

        //启用样式
        this._enableCss = function() {
            $el.css('backgroundColor', '#F17E22');
            $el.css('color', 'white');
            $el.text('获取验证码');
        };

        //立刻启用按钮
        this.enable = function() {
            $el.text('获取验证码');
            this._enableCss();
            isEnable = true;
            clearInterval(timeHandle);
        };

        //立刻调用发送手机验证码之后禁用按钮
        this.disable = function() {
            clearInterval(timeHandle);
            isEnable = true;
            this._addClick();
        };

        this._initliaze();
    },
	Service: Service
};

function Service() {}

Service.prototype = {
	then:  function(success, error) {
		this.success = success;
		this.error = error;
	},
	ajax: function(ops) {
		var self = this;
		var result = $.extend({
			success:function(result) {
				if(result.msg && result.msg.indexOf('登录信息已过期') > -1) {
					scope.alert(result.msg);
					setTimeout(function() {
						scope.go('#/login');
					}, 1000);
				} else {
					self.success(result);
				}
			},
			error: function(result) {
				self.error && self.error(result);
			}
		}, ops);
		result.url = config.service.server + ops.url;
		$.ajax(result);
	},
	reject: function() {

	}, 
	resolve: function() {

	}
}