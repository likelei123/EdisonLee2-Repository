require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/withdrawal.scss');
var tool = require('../../../public/component/toollib.js');
var Vue = require('../../../public/lib/vue.js');
var text = require('../view/withdrawal.html');
module.exports={
    init:function ($el) {
        this.$el=$el || $(document.body);
        this.render();
        this.initVue();
    },
    render:function () {
        this.$el.html(text)
    },
    initVue:function () {
        this.$scope={

            lists_show:false,
            sec_show:false
        };
        var self=this;
        this.vue=new Vue({
            el:".box-withdrawal",
            data:this.$scope,
            methods:{
                OnGoback:function () { self.OnGoback() },
                OnCard:function () {self.OnCard() },
                Onhide:function (e) {self.Onhide(e)}
            }
        })
        
    },
    OnCard:function () {
        var scope=this.$scope;
        scope.lists_show=true;
    },
    Onhide:function (e) {
        console.log(e)
         var scope=this.$scope;
        scope.lists_show=false;
    },
    OnGoback:function () {
        tool.back();
    }


}