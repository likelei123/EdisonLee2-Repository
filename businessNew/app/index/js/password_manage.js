require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/password_manage.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/password_manage.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
module.exports={
    init:function ($el) {
        this.$el=$el || $(document.body);
        this.render();
        this.initVue();
    },
    render:function () {
        this.$el.html(text);
    },
    initVue:function () {
        this.$scope={

        };
        var self=this;
        this.vue=new Vue({
            el:".password-manage",
            data:this.$scope,
            methods:{
                GoChangepassword:function () {
                    self.GoChangepassword();
                },
                Gowithdrawalpassword:function () {
                    self.Gowithdrawalpassword();
                }
            }
        })
    },
    GoChangepassword:function () {
        tool.go('#/login/forgetpassword',{tagname:'ChangePassword'})
    },
    Gowithdrawalpassword:function () {
          tool.go('#/login/forgetpassword',{tagname:'WithdrawalPassword'})
    }
}