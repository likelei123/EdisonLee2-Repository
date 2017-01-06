require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/enter_city.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state");
var text = require("../view/enter_city.html");
module.exports={
    init:function($el){
          this.$el = $el || $(document.body);
          this.render();
          this.$scope={
              states:{
              },
              itmes:{
                   position_city: [
                       { cityname: "北京"}, 
                     { cityname: "四川"}
                ],
                    hotcity:[
                    {cityname:"四川"},
                    {cityname:"成都"}
                ],
                A:[
                    {cityname:"阿坝"},
                    {cityname:"安庆"},
                    {cityname:"安顺"}
                    ],
              }
              
          };
          this.initVue();
    },
    render:function(){
          var $html = $(text);
        this.$el.html($(text));
    },
    initVue:function(){
        var self=this;
        this.vue=new Vue({
            el:".enter-city",
            data:self.$scope,
            methods:{
                onGoback:function(){
                    self.onGoback();
                },
                onGocity:function(event){
                    self.onGocity(event);
                }
            }
        })
    },
    onGoback:function(){
        tool.back()
    //    $state.emit("testfnction","2322");
    },
    onGocity:function(event){
      var iscity=$(event.target).html();
      $state.emit("city",iscity);
          tool.back();
    },
}