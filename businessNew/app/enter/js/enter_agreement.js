require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/enter_agreement.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state");
var text = require("../view/enter_agreement.html");
module.exports={
    init:function($el){
        this.$el=$el || $(document.body);
        this.render();
        this.$scope={
            states:{},
            itmes:{},
        }
        this.inintVue();
    },
    render:function(){
        var $html=$(text);
        this.$el.html($html)
    },
    inintVue:function(){
        var self= this;
        this.vue=new Vue({
            el:".enter-agreement",
            data:this.$scope,
            methods:{
                onGomap:function(){self.onGomap()},
                onGoback:function(){self.onGoback()}
                 
            }  
        })
    },
    onGomap:function(){
        tool.go("#/enter_map")
    },
    onGoback:function(){
        tool.back();
    }
}