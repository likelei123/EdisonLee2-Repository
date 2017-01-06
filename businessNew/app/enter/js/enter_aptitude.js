require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/enter_aptitude.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state");
var text = require("../view/enter_aptitude.html");
var EnterAptitudeService = require('./enter_aptitude_service.js');

var scope = null;
window.bizLicencePhoto = function(ops) {
    scope.selectImageCallback(ops, 'bizLicencePhoto');
};
window.shopOutlookPhoto = function(ops) {
    scope.selectImageCallback(ops, 'shopOutlookPhoto');
};
window.ownerIdPhotoFront = function(ops) {
    scope.selectImageCallback(ops, 'ownerIdPhotoFront');
};
window.ownerIdPhotoBack = function(ops) {
    scope.selectImageCallback(ops, 'ownerIdPhotoBack');
};
module.exports = scope = {
    init:function($el){
        this.$el = $el || $(document.body);
        this.service = new EnterAptitudeService(this);
        this.params = $state.getParams();
        this.render();
        this.$scope = {
            states: {},
            data: {
                bizLicenceCode: "",
                ownerName: "",
                ownerPhone: "",
                ownerId: "",
                bizLicencePhoto: "",
                shopOutlookPhoto: "",
                ownerIdPhotoFront: "",
                ownerIdPhotoBack: ""
            }
        }
        this.initVue();
    },
    render:function(){
        this.$el.html(text);
    },
    initVue:function(){
        var self = this;
        this.vue = new Vue({
            el:".enter-aptitude",
            data:this.$scope,
            methods:{
                onGoback:function() { self.onGoback() },
                saveDetials: function() { self.saveDetials() }
            }
        });
    },
    onGoback:function(){
        tool.back();
    },
    saveDetials: function() {
        this.validateToNext();
    },
    validateToNext: function() {
        var d = this.$scope.data;
        if(!d.bizLicencePhoto) {
            tool.alert('请上传营业执照图片！');
            return;
        }
        if(!d.bizLicenceCode) {
            tool.alert('请输入营业执照号！');
            return;
        }
        if(!d.shopOutlookPhoto) {
            tool.alert('请上传店铺外观图片！');
            return;
        }
        if(!d.ownerIdPhotoFront) {
            tool.alert('请上传法人身份证正面！');
            return;
        }
        if(!d.ownerIdPhotoBack) {
            tool.alert('请上传法人身份证反面！');
            return;
        }
        if(!d.ownerName) {
            tool.alert('请输入法人姓名！');
            return;
        }
        if(!d.ownerPhone) {
            tool.alert('请输入法人电话！');
            return;
        }
        if(!d.ownerId) {
            tool.alert('请输入法人身份证号！');
            return;
        }

        this.$scope.data.token = this.params.tocken;
        this.$scope.data.shopName = this.params.shopName;
        this.$scope.data.shopId = this.params.shopId;
        
        this.service.saveShopDetaile(this.$scope.data);
    },
    saveShopDetaileInfoCallback: function(result) {
        if(result.status) {
            tool.alert('店铺入驻流程已功能完成，即将去登录页！');
            setTimeout(function() {
                tool.go('#/login');
            }, 1000);
        } else {
            tool.alert(result.msg);
        }
    },
    selectImageCallback: function(ops, type) {
        var self = this;
        tool.imgFileUploads(ops, function(result) {
            if(result.length > 0) {
                self.$scope.data[type] = result[0];
            } else {
                tool.alert('图片加载失败！');
            }
        });
    }
}