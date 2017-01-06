require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/add.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/subpage/add.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var AddService = require("../js/addService.js");

window.empImgback = function (ops) {
    scope.empImgback(ops)
};

window.addImages = function (ops) {
    scope.addImages(ops);
};
var scope = null;
module.exports = scope = {
    init: function ($el) {
        var params = $state.getParams();
        if (params.isRefresh) {
            this.$el = $el || $(document.body);
            this.render();
            this.service = new AddService(this);
            this.initVue();
        } else {

        }
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            contentShow: false,
            set_info: {
                empName: "",
                empJob: "",
                empCellphone: "",
                verification: "",
                shopModuleIds: "",
                empPhoto: "",
                empInstructions: "",
                empImg: ""
            },
            textlength: "0",
            power: [],
            back: [],
            phone: [],
            hideaddphone:true
        };
        this.vue = new Vue({
            el: '.subpage_add',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack()
                },
                onPermissions: function () {
                    self.onPermissions()
                },
                openActive: function () {
                    self.openActive()
                },
                ObtainAdd: function () {
                    self.ObtainAdd();
                },
                OnGetCode: function () {
                    self.OnGetCode();
                }
            },
            ready: function () {
                $state.on("backdata", function (params) {
                    console.log(params)
                    self.$scope.back = [];
                    self.$scope.back = params;
                    self.$scope.power.length = 0;
                    var i = 0;
                    for (; i < self.$scope.back.length; i++) {
                        self.$scope.power.push(self.$scope.back[i].moduleid);
                        //self.$scope.back[i].moduleid = '';
                    };
                })
            },
            watch: {
                "set_info.empInstructions": function (val, old) {
                    if (0 <= val.length && val.length <= 500) {
                        //console.log(val.length)
                        self.$scope.textlength = val.length
                    } else {
                        val.length = "";
                    }

                }
            },
        })
    },
    goBack: function () {
        tool.back();
    },
    onPermissions: function () {
        tool.go('#/pow', {
            hash: window.location.hash
        });
    },
    //图片上传
    empImgback: function (ops) {
        var ops = ops;
        var self = this;
        tool.imgFileUploads(ops, function (result) {
            if (result.length > 0) {
                self.$scope.set_info.empImg = result[0];
            } else {
                tool.alert('图片加载失败！');
            }
        });
    },
    addImages: function (ops) {
        var self = this;
        tool.imgFileUploads(ops, function (result) {
            if (result.length > 0) {
                var list = [];

                for (var i = 0; i < result.length; i++) {
                    self.$scope.phone.push(
                        result[i]
                    );
                    if(self.$scope.phone.length>4){
                        self.$scope.hideaddphone=false;
                    }else{
                         self.$scope.hideaddphone=true;
                    }
                    list.push(result[i]);
                };
                // alert(JSON.stringify( self.$scope.phone))
                self.$scope.set_info.empPhoto = list.join(",");
                //self.$scope.phone.splice(0, 99);
            } else {
                tool.alert('图片加载失败！');
            }
        });
    },
    openActive: function () {
        this.$scope.contentShow = !this.$scope.contentShow;
    },
    //添加员工的所需的参数获取
    ObtainAdd: function () {
        var UserInfo = tool.getUserInfo();
        var setinfoscope = this.$scope.set_info;
        setinfoscope.token = UserInfo.token;
        setinfoscope.shopId = UserInfo.shopId;
        setinfoscope.shopModuleIds = this.$scope.power.join(",");
        // setinfoscope.empPhoto = this.$scope.phone.join(",")
        console.log(setinfoscope.shopModuleIds)
        if (this.$scope.contentShow) {
            setinfoscope.isShow = 1;
            //alert(JSON.stringify(this.$scope.set_info))
            this.service.SetAddInfo(this.$scope.set_info)

        } else {
            setinfoscope.isShow = 0;
            this.service.SetAddInfo(this.$scope.set_info)
        }

    },
    //添加员工成功返回的数据
    SetAddData: function (params) {
        console.log(params);
        if (params.status) {
            alert(JSON.stringify(params))
            tool.alert("恭喜您创建成功");
            setTimeout(function () {
                tool.back();
            }, 1000)

        } else {
            tool.alert(params.msg)
        }
    },
    //获取手机验证码发送的参数
    OnGetCode: function () {
        var UserInfo = tool.getUserInfo();
        console.log(this.$scope.set_info.empCellphone)
        var codeobj = {
            empCellphone: this.$scope.set_info.empCellphone,
            token: UserInfo.token
        }
        this.service.SetCodeInfo(codeobj)
    },
    //获取成功以后 返回的参数
    GetCodeData: function (params) {
        if (params.status) {
            this.$scope.set_info.verification = params.msg
        }else{
            tool.alert(params.msg)
        }
        console.log(params)
    }

}