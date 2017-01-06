require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/shop_qualifi.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/shop_qualifi.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var qualifiService = require("../js/shop_qualifiService")
window.empImgback = function (ops) {
    scope.empImgback(ops)
}
var scope = null;
module.exports = scope = {
    init: function ($el) {
        this.$el = $el || $(document.body);

        this.render();
        this.service = new qualifiService(this)
        this.ininVue();
        this.SendExaminationDetalisLnfo();
        this.isAdmin();
    },
    render: function () {
        this.$el.html(text);
    },
    ininVue: function () {
        this.$scope = {
            backdata: {},
            set_info: {
                bizLicenceCode: "",
                bizLicencePhoto: "",
                ownerId: "",
                ownerName: "",
            },
            show_hide: false,
            imges: "../../../public/images/audit_success.png",
            p_text: "",
            tijiao: false
        }
        var self = this;
        this.vue = new Vue({
            el: ".shop-qualifi",
            data: this.$scope,
            methods: {
                GoBack: function () {
                    self.GoBack();
                },
                SendEditExaminationLnfo: function () {
                    self.SendEditExaminationLnfo();
                }
            }
        })
    },
    GoBack: function () {
        tool.back();
    },
    //发送资质详情的参数
    SendExaminationDetalisLnfo: function () {
        var UserInfo = tool.getUserInfo();
        if (UserInfo) {
            var ExaminationDetalisobj = {
                shopId: UserInfo.shopId
            };
            this.service.sendCheckExamination(ExaminationDetalisobj)
        } else {
            tool.alert("是否有该店")
        }
    },
    BackExaminationDetalisData: function (data) {
        console.log(data)
        if (data.status && data.data) {
            this.$scope.backdata = data.data;
        } else {
            tool.alert(data.msg)
        }
    },
    //发送编辑资质的参数
    SendEditExaminationLnfo: function () {
        var UserInfo = tool.getUserInfo();
        var scope = this.$scope;
        if (UserInfo) {
            scope.set_info.token = UserInfo.token;
            scope.set_info.shopId = UserInfo.shopId;
            scope.set_info.bizLicencePhoto = scope.backdata.bizLicencePhoto;
            console.log(scope.set_info);
            this.service.sendEditExaminationInfo(scope.set_info)
        } else {
            tool.alert("请查看是否有次店铺")
        }
    },
    BackEditExaminationData: function (data) {
        console.log(data);
        if (data.status) {
            tool.alert("修改成功");
            setTimeout(function () {
                tool.back();
            }, 1000)
        } else {
            tool.alert(data.msg)
        }
    },
    //上传图片 
    empImgback: function (ops) {
        //alert(JSON.stringify(ops))
        var ops = ops;
        var self = this;
        tool.imgFileUploads(ops, function (result) {
            if (result.length > 0) {
                self.$scope.backdata.bizLicencePhoto = result[0];
            } else {
                tool.alert('图片加载失败！');
            }
        });
    },
    //判断是否是管理员 和审核的几种状态
    isAdmin: function () {
        var Params = $state.getParams();
        console.log(Params.shopStatus);
        console.log(Params.isAdmin);
        var scope = this.$scope;
        if (Params.shopStatus == 11) {
            scope.imges = "../../../public/images/audit_success.png";
            scope.show_hide = true;
              scope.tijiao=false;
              scope.p_text="恭喜您的店铺已经认证通过，您已成为我们平行世界的商家"
            console.log("审核通过")
        } else if (Params.shopStatus == 2) {
            console.log("审核中");
            scope.imges = "../../../public/images/audit_zhong.png";
            scope.show_hide = true;
            scope.tijiao=false;
            scope.p_text="您的店铺正在审核中，请耐心等待"
        } else if (Params.shopStatus == 4) {
            console.log("审核失败")
            scope.imges = "../../../public/images/audit_success.png";
            scope.p_text="对不起您上传的手机号和营业执照号有误，无法通过认证，请核对好信息以后重新上传"
            if (Params.isAdmin == 1) {
                scope.show_hide = false;
            }else{
                  scope.show_hide = true;
            };
              scope.tijiao=true;
        }
    }
}