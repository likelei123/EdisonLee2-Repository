require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/particulars.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/subpage/particulars.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var ParticularsService = require("../js/particularService.js");
window.empImgback = function (ops) {
    scope.empImgback(ops)
};
window.addImages = function (ops) {
    scope.addImages(ops);
};
var scope = null;

var moduleText = require('../view/subpage/particulars_cap.html');
module.exports = scope = {
    init: function ($el) {
        var Params = $state.getParams();
        // console.log(Params);
        // console.log(Params);
        if (Params.isRefresh) {
            this.$el = $el || $(document.body);
            this.service = new ParticularsService(this)
            this.render();
            this.initVue();
        } else {

        }


    },
    render: function () {
        var $html = $(text);
        $html.append(moduleText);
        this.$el.html($html);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            whole: false,
            contentShow: false,
            cap: 1,
            makeCannot: false,
            statuslizhi: true,
            statusligang: true,
            statusshanggang: true,
            foot: true,
            pingyong: true,
            baocun: true,
            res: {},
            back: [], //页面间返回参数
            power: [], //返回参数的转换
            houtaiback: [],
            //给后台发送的参数
            set_info: {
                empName: "",
                empId: "",
                empJob: "",
                empCellphone: "",
                empImgs: "",
                shopModuleIds: [],
                isShow: "",
                empPhoto: "",
                empInstructions: null
            },
            //上传图片的路径
            phone: [],
            textlength: "0",
            hideaddphone: true,
        };
        this.vue = new Vue({
            el: '.subpage_particulars',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                active: function (index) {
                    self.active(index);
                },
                affirm: function () {
                    self.affirm();
                },
                openActive: function () {
                    self.openActive();
                },
                Cannot: function () {
                    self.Cannot();
                },
                Gopower: function () {
                    self.Gopower();
                },
                OnEnsure: function () {
                    self.OnEnsure();
                },
                Onbinji: function () {
                    self.Onbinji()
                },
                OnSave: function () {
                    self.OnSave()
                },
                Onpingyong: function (params) {
                    self.Onpingyong();
                },
                Ondelet: function (index) {
                    self.Ondelet(index)
                },
            },
            ready: function () {
                $state.on("backdata", function (params) {
                     self.$scope.houtaiback=[];
                     self.$scope.houtaiback=params;
                    // self.$scope.back = [];
                    // self.$scope.back = params;
                    // self.$scope.power.length = 0;
                    var i = 0;
                    for (; i < self.$scope.houtaiback.length; i++) {
                        self.$scope.power.push(self.$scope.houtaiback[i].moduleid);
                        self.$scope.houtaiback[i].moduleid = '';
                    };
                })
                self.Getempid();
                self.Getpermis();
                self.staffstatus();

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
    active: function (index) {
        this.$scope.whole = true;
        this.$scope.cap = index;
        // this.OnEnsure(index)
    },
    affirm: function () {
        this.$scope.whole = false;
    },
    openActive: function () {
        this.$scope.contentShow = !this.$scope.contentShow;
    },
    Cannot: function () {
        this.$scope.foot = false;
        this.$scope.pingyong = false;
        this.$scope.makeCannot = true;
    },
    Gopower: function (params) {
        tool.go("#/pow", {
            hash: window.location.hash
        })
    },
    //点击删除上传的图片
    Ondelet: function (index) {
          this.$scope.phone.splice(index, 1)
        if (this.$scope.phone.length > 4) {
            self.$scope.hideaddphone = false;
        } else {
            this.$scope.hideaddphone = true;
        }
      
    },
    //判断员工是什么状态
    staffstatus: function () {
        var status = $state.getParams().meg;
        if (status == "在岗") {
            console.log("在岗");
            this.$scope.statusshanggang = false
        } else if (status == "员工墙") {
            this.$scope.statusshanggang = false;
            console.log("员工墙")
        } else if (status == "离职") {
            this.$scope.foot = false;
            console.log("离职")
        } else if (status == "离岗") {
            this.$scope.statusligang = false
        }
    },
    //发送员工id
    Getempid: function () {
        var UserInfo = tool.getUserInfo();
        var empid = $state.getParams().empId;
        if (UserInfo) {
            var setstaffobj = {
                token: UserInfo.token,
                empId: empid,
                shopId: UserInfo.shopId
            };
            this.service.SetStaffInfo(setstaffobj)
        } else {
            tool.alert("UserInfo中无参数")
        }
    },
    //获取员工详情
    BackStaffDate: function (params) {
        console.log(params);
        if (params.status) {
            this.$scope.res = params.data;
            this.$scope.phone = params.data.empPhoto
            if (params.data.isShow == 1) {
                this.$scope.contentShow = true;

            } else {
                this.$scope.contentShow = false;
            }

        } else {
            tool.alert("没有添加过次员工")
        }
    },
    //发送员工id
    Getpermis: function () {
        var empid = $state.getParams().empId;
        if (empid) {
            var permisobj = {
                empId: empid
            };
            this.service.SetRightsInfo(permisobj)
        } else {
            tool.alert("没有此员工")
        }
    },
    //获取员工权限
    BackRightsData: function (databack) {
        //console.log(databack)
        //  this.$scope.back="";
        if (databack.status) {
            this.$scope.houtaiback = databack.data;
        } else {
            tool.alert("没有此员工")
        }
    },
    //判断员工状态发送不同的参数
    OnEnsure: function () {
        this.$scope.whole = false;
        var index = this.$scope.cap;
        if (index == 1) {
            var state = 0;
            this.Setempid(state)
            console.log("离职")
        } else if (index == 2) {
            console.log("离岗");
            var state = 1;
            this.Setempid(state)
        } else if (index == 3) {
            var state = 2;
            console.log("上岗");
            this.Setempid(state)
        };
    },
    Onpingyong: function (params) {
        var state = 2;
        console.log("上岗");
        this.Setempid(state)
    },
    //发送员工id
    Setempid: function (state) {
        var UserInfo = tool.getUserInfo();
        var empid = $state.getParams().empId;
        if (empid) {
            var Statusobj = {
                empId: empid,
                status: state,
                token: UserInfo.token,
                shopId: UserInfo.shopId
            };
            this.service.SetStatusInfo(Statusobj);
        } else {
            tool.alert("没有此员工")
        }
    },
    //修改员工状态
    GetStatusData: function (databack) {
        console.log(databack)
        if (databack.status) {
            setTimeout(function (params) {
                tool.back();
            }, 1000)
        } else {
            tool.alert(databack.msg)
        }
    },
    //图片上传
    empImgback: function (ops) {
        var ops = ops;
        var self = this;
        //alert(JSON.stringify(ops))
        tool.imgFileUploads(ops, function (result) {
            if (result.length > 0) {
                self.$scope.res.empImgs = result[0];
                self.$scope.set_info.empImgs = result[0];
            } else {
                tool.alert('图片加载失败！');
            }
        });
    },

    addImages: function (ops) {
        var self = this;
        var list = [];
        tool.imgFileUploads(ops, function (result) {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    self.$scope.phone.push(
                        result[i]);
                    list.push(result[i]);

                };
                if (self.$scope.phone.length > 4) {
                    self.$scope.hideaddphone = false;
                } else {
                    self.$scope.hideaddphone = true;
                }
                self.$scope.set_info.empPhoto = list.join(",");
            } else {
                tool.alert('图片加载失败！');
            }
        });
    },
    //点击保存发送编辑的参数
    OnSave: function () {
        var scope = this.$scope;
        var empid = $state.getParams().empId;
        var UserInfo = tool.getUserInfo();
       //var i = 0;
        scope.set_info.token = UserInfo.token;
        scope.set_info.shopId = UserInfo.shopId;
        scope.set_info.empId = empid;
        if(this.$scope.power.length>0){
              scope.set_info.shopModuleIds = this.$scope.power.join(",");
        }else{
            var i=0,power=[];
            for(;i<scope.houtaiback.length;i++){
               power.push(scope.houtaiback[i].shopModuleId)
            };
             scope.set_info.shopModuleIds =power.join(",")
        }
        scope.set_info.empPhoto = this.$scope.phone.join(",");
       // console.log(scope.contentShow)
        if (scope.contentShow) {
            scope.set_info.isShow = "1";
        } else {
            scope.set_info.isShow = "0";
        }
        console.log(scope.set_info)
         //alert(JSON.stringify(scope.set_info));
        this.service.SetWallEditUrlInfo(scope.set_info);
    },
    //编辑成功返回的参数
    GetEditUrlData: function (databack) {
        console.log(databack);
        if (databack.status) {
            tool.alert("恭喜你编辑成功")
            setTimeout(function () {
                tool.back();
            }, 1000)
        } else {
            tool.alert(databack.msg)
        }
    }


}