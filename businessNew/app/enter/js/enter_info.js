require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/enter_info.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state");
var text = require("../view/enter_ Info.html");
var EnterInfoService = require('./enter_info_service.js');

window.enterLoadImageCallback = function(ops) {
    tool.imgFileUploads(ops, function(result) {
        if(result.length > 0) {
            scope.$scope.loginImageUrl = result[0];
        } else {
            tool.alert('图片加载失败！');
        }
    });
}

window.enterInnerLoadImageCallback = function (ops) { 
    tool.imgFileUploads(ops, function(result) {
        if(result.length > 0) {
            scope.$scope.innerImageUrl = result[0];
        } else {
            tool.alert('图片加载失败！');
        }
    });
 }
var scope = null;
module.exports = scope = {
    init: function ($el) {
        this.params = $state.getParams();
        if(this.params.isRefresh) {
            this.$el = $el || $(document.body);
            this.service = new EnterInfoService(this);
            this.userInfo = tool.getUserInfo();
            this.render();
            this.$scope = {
                states: {
                    show_none: "none",
                    li_index: "-1",
                    fen_index: "-1",
                    i_index:"",
                    shi:"",
                    fen:"",
                    shistring:"",
                    fenstring:"",
                    times: [],
                    minutes: []
                },
                itmes: {},
                loginImageUrl: "",
                innerImageUrl: "",
                shopName: this.params.shopName,
                shopAddress: "",
                shopPhone: "",
                startTime: "",
                endTime: "",
                shopTag: "",
                tradeType: "",
                tradeTypeId: "",
                tradeName: "",
                tradeNameId: ""
            };
            this.ininVue();
            var self = this;
            $state.on("enterSelectTradeCallback", function (ops) { 
                // var ops = {
                //     level: 1,
                //     catId: 3,
                //     catName: "xxx"
                // };
                if(ops.level == 1) {
                    self.$scope.tradeType = ops.catName;
                    self.$scope.tradeTypeId = ops.catId;

                    self.$scope.tradeName = "";
                    self.$scope.tradeNameId = "";
                } else if (ops.level == 2) {
                    self.$scope.tradeName = ops.catName;
                    self.$scope.tradeNameId = ops.catId;
                }
             });
        }
    },
    render: function () {
        this.$el.html(text)
    },
    ininVue: function () {
        var self = this;
        this.vue = new Vue({
            el: ".enter-info",
            data: this.$scope,
            ready: function () {
                self.push_time();
            },
            methods: {
                onGoback: function () {self.onGoback(); },
                onshow: function (meg) { self.onshow(meg); },
                on_Hide: function () { self.on_Hide(); },
                onLI: function (index) { self.onLI(index); },
                onLifen:function(index,event){ self.onLifen(index); },
                isSure:function(){ self.isSure(); },
                onGoaptitude:function(){ self.onGoaptitude(); },
                onSelectTrade: function(type, status) { self.onSelectTrade(type, status); },
                onSelectImage: function() { self.onSelectImage() }
            }
        })
    },
    onGoback: function () {
        tool.back();
    },
    onshow: function (meg) {
        var mydata = this.$scope.states;
        mydata.i_index=meg;
        mydata.show_none = "block";
    },
    on_Hide: function () {
        var mydata = this.$scope.states;
        mydata.show_none = "none";
    },
    push_time: function () {
        var mydata = this.$scope.states;
        var num = 0,
            num2 = 0;
        for (var i = 0; i <= 23; i++) {
            num = num + 1;
            //console.log(num)
            var objtime = {};
            if (i == 0) {
                num = 0;
                objtime.shi = "00"
            } else if (i < 10) {
                objtime.shi = '0' + num;
            } else {
                objtime.shi = num;
            }
            mydata.times.push(objtime)
        }
        for (var j = 0; j < 59; j++) {
            num2 = num2 + 1;
            var objfen = {};
            // console.log(num2)
            if (j == 0) {
                objfen.fen = "00";
            } else if (j < 9) {
                objfen.fen = '0' + num2;
            } else {
                objfen.fen = num2;
            }
            mydata.minutes.push(objfen)
        }
    },
    onLI: function (index) {
        var mydata = this.$scope.states;
        mydata.li_index = index
        console.log(mydata.times[index].shi);
        mydata.shi=mydata.times[index].shi;
    },
    onLifen:function(index){
        var mydata = this.$scope.states;
        mydata.fen_index=index;
        console.log(mydata.minutes[index].fen)
        mydata.fen=mydata.minutes[index].fen;
    },
    isSure:function(){
        var mydata = this.$scope.states;
        if(mydata.shi == "" || mydata.fen == "") {
            tool.alert('请选择时间！');
            return ;
        }
        this.$scope.startTime = mydata.shi+':00';
        this.$scope.endTime = mydata.fen+':00';
        if(mydata.i_index==1){
            mydata.shistring=mydata.shi+":"+mydata.fen;
        }else{
             mydata.fenstring=mydata.shi+":"+mydata.fen;
        }
        mydata.show_none = "none";
    },
    onGoaptitude:function(){
        this.validateToNext();
    },
    onSelectTrade: function(type, status) {
        if(status == 1) {
            tool.go('#/enter_trade', {
                windowHash:window.location.hash,
                type: type,
                status: status,
            });
        } else if(status == 2 && this.$scope.tradeTypeId != "") {
            tool.go('#/enter_trade', {
                windowHash:window.location.hash,
                type: type,
                status: status,
                catId: this.$scope.tradeTypeId
            });
        } else {
             tool.alert('请选择行业类别！');
        }
        
    },
    onSelectImage: function() {
        // tool.loadImgPlugin({
        //     callbackName:'callback',
        //     number: 1
        // });
    },
    validateToNext: function() {
        if(!this.$scope.loginImageUrl) {
            tool.alert('请选择店铺LOG图！');
            return;
        }
        if(!this.$scope.shopAddress) {
            tool.alert('请输入店铺的地址！');
            return;
        }
        if(!this.$scope.shopPhone) {
            tool.alert('请输入电话号码！');
            return;
        }
        if(!this.$scope.tradeNameId) {
            tool.alert('请选择行业信息数据！');
            return ;
        }
        if(!this.$scope.startTime || !this.$scope.endTime) {
            tool.alert('请选择店铺的时间！');
            return ;
        }
        if(!this.$scope.shopTag) {
            tool.alert('请填写店铺标签！');
            return ;
        }

        var result = {
            shopName: this.params.shopName,
            token: this.userInfo.token,
            shopCode: this.params.shopCode,
            shopLat: this.params.shopLat,
            shopLng: this.params.shopLng,
            shopLogo: this.$scope.loginImageUrl,
            shopAddr: this.$scope.shopAddress,
            shopTel: this.$scope.shopPhone,
            // categoryCode: this.params.shopCategory,
            // parentCode: this.params.parentShopCategory,
            parentCode: this.$scope.tradeTypeId,
            categoryCode: this.$scope.tradeNameId,
            categoryName: this.params.shopCategoryName,
            startTime: this.$scope.startTime,
            endTime: this.$scope.endTime,
            shopLabel: this.$scope.shopTag,
            buildingId: this.params.buildingId,
            shopPhoto:this.$scope.innerImageUrl
        } 
        //alert(JSON.stringify(result))
        this.service.saveShopSimple(result);
    },
    saveShopSimpleCallback: function(result) {
        this.params.tocken = this.userInfo.token;
        var params = this.params;
        if(result.status) {
            params.shopId = result.data;
            tool.alert('基础信息保存成功！');
            setTimeout(function() {
                tool.go("#/enter_aptitude", params);
            }, 1000);
        } else {
            tool.alert(result.msg);
        }
    }
}