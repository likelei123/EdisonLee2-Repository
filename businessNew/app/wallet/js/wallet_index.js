require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/wallet_index.scss');
var tool = require('../../../public/component/toollib.js');
var Vue = require('../../../public/lib/vue.js');
var text = require('../view/wallet_index.html');


module.exports= {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();
        this.initVue();
    },
    render: function () {
        this.$el.html(text)
    },
    initVue:function () {
        this.$scope={}
        var self=this;
        this.vue=new Vue({
            el:".wallet-index",
            data:this.$scope,
            methods:{
                ListGo:function (url,ops) {
                    self.ListGo(url,ops)
                },
                Goback:function () {
                    self.Goback();
                }
            }
        })
    },
    ListGo:function (url,ops) {
        if(ops){
              tool.go(url,ops)
        }else{
              tool.go(url)
        }
    },
    Goback:function () {
        tool.back();
    }

}