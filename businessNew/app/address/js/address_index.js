require("../../../public/lib/zepto.min.js");
require('!style!css!sass!../scss/address_index.scss');
var Vue = require("../../../public/lib/vue.js");
var tool = require("../../../public/component/toollib.js");
var $state = require("../../../public/component/$state.js");
var text = require("../view/address_index.html");
var MassageService = require("../js/address_indexService");

module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();


        this.service = new MassageService(this);
        this.initVue();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
    },
    initVue: function () {
        this.$scope = {
            states: {},
            itmes: {
                arryr: [],
                arryd: []
            }
        };
        var self = this;
        this.vue = new Vue({
            el: ".adress-box",
            data: this.$scope,
            methods: {
                onBack: function () {
                    self.onBack();
                },
                onGodetails_re: function (meg, index) {
                    self.onGodetails_re(meg, index);
                },
                onGoeditor: function (meg) {
                    self.onGoeditor(meg);
                },
                onGodetails_de: function (meg, index) {
                    self.onGodetails_de(meg, index);
                }
            },
            ready: function () {
                self.SetMassageData()
            }
        });
    },
    onBack: function () {
        tool.back();
    },
    onGodetails_re: function (meg, index) {
        //console.log(this.$scope.itmes.arryr[index].goodid);
        var goodsid = {};
        goodsid.id = this.$scope.itmes.arryr[index].goodid;
        goodsid.megs = meg;
        tool.go("#address_details", {
            the_value: goodsid
        })
    },
    onGodetails_de: function (meg, index) {
        //console.log(this.$scope.itmes.arryd[index].goodid);
        var goodsid = {};
        goodsid.id = this.$scope.itmes.arryd[index].goodid;
        goodsid.megs = meg;
        tool.go("#address_details", {
            the_value: goodsid
        })
    },
    onGoeditor: function (meg) {
        //console.log(meg)
        tool.go("#address_details", {
            the_value: meg
        });
    },
    SetMassageData: function () {
        var UserInfo = tool.getUserInfo()
        console.log(UserInfo)
        if (UserInfo) {
            var massage = {
                shopId: UserInfo.shopId,
                token: UserInfo.token
            };
            this.service.AddressMassage(massage);
        }else{
            tool.alert("UserInfo中没有数据")
        }

        
    },
    AddressMassageData: function (req) {
        //console.log(this)
        var backdata = req,
            i = 0;
        console.log(backdata)
        if (backdata.data) {
            for (; i < backdata.data.length; i++) {
                if (backdata.data[i].isRecvAddr == 1) {
                    console.log("退货地址")
                        // console.log(backdata.data[i])
                    this.$scope.itmes.arryr.push(backdata.data[i])
                } else if (backdata.data[i].isRecvAddr == 0) {
                    console.log("发货地址")
                        //  console.log(backdata.data[i])
                    this.$scope.itmes.arryd.push(backdata.data[i])
                }
            }
        } else {
            tool.alert("你还未添加任何地址数据！");
        }

    }


};