require("../../../public/lib/zepto.min.js");
// require('!style!css!sass!../scss/address_details.scss');
require('!style!css!sass!../scss/address_details.scss');
var Vue = require("../../../public/lib/vue.js");
var tool = require("../../../public/component/toollib.js");
var $state = require("../../../public/component/$state.js");
var text = require("../view/address_details.html");
var Address = require("../../../public/component/address.js");
var AddressDetails = require("../js/address_detailsService")
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.service = new AddressDetails(this);
        this.userInfo = tool.getUserInfo();
        this.render();
        this.$scope = {
            states: {
                title: "", //头部的文字
                is_show: "none", //控制按钮的显隐
                is_hide: "none", //控制按钮的显隐
                write: "true", //input框是否可写控制
                isgoodsid: "", //从前面页面获取到id
                is_re_de: "", //获取是退货或发货
                name: "",
                tel: '',
                addrdetail: "",
                zipcode: "",
                provinceId: "",
                cityId: "",
                countyId: "",

                provinceName: "选择地区",
                cityName: "",
                countyName: "",

                isDefault: "0"
            },
            data: {

            }
        };
        this.initVue();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
        //console.log($state.getParams())
    },
    initVue: function () {
        var self = this;
        Vue.component('address', Address)
        this.vue = new Vue({
            el: ".address-details",
            data: this.$scope,

            events: {
                'address-getValue': function (ops) {
                    var myscope = self.$scope.states;
                    myscope.provinceId = ops[0].ProID;
                    myscope.cityId = ops[1].CityID;
                    myscope.countyId = ops[2].countyId;
                    myscope.provinceName = ops[0].name
                    myscope.cityName = ops[1].name;
                    myscope.countyName = ops[2].DisName
                }

            },
            methods: {
                onBack: function () { self.onBack(); },
                onEditor: function () { self.onEditor(); },
                onOpenAddress: function () { this.$broadcast("address-show"); },
                validateAddressInfo: function() { self.validateAddressInfo() }
            },
            ready: function () {
                self.inpts();
            }
        });
    },
    onBack: function () {
        // $state.emit("testfnction", this.$scope);
        tool.back();
    },

    inpts: function () {
        if ($state.getParams()) {
            var ischoose = $state.getParams().the_value;
            var mydata = this.$scope.states;
            if (ischoose == "return") {
                mydata.title = "退货地址";
                //mydata.is_hide="none";
                mydata.is_show = "block";
                // alert(mydata.is_show)
                mydata.write = false;
                console.log("退货")
            } else if (ischoose == "delivery") {
                mydata.title = "发货地址";
                //mydata.is_hide="none";
                mydata.is_show = "block";
                mydata.write = false;
                console.log("发货")
            } else {
                mydata.title = "地址详情";
                mydata.is_hide = "block";
                mydata.isgoodsid = ischoose.id;
                mydata.is_re_de = ischoose.megs;
                console.log("详情")
            }
            //console.log(ischoose);
        } else {
            console.log("不是编辑")
        }
    },

    onEditor: function () {
        var mydata = this.$scope.states;
        console.log(mydata.isgoodsid);
        console.log(mydata.is_re_de)
        mydata.write = false;
        //mydata.is_hide="block";
        //alert(  mydata.is_hide)
        mydata.is_show = "block";
        mydata.is_hide = "none";
        if (mydata.is_re_de == "return") {
            mydata.title = "退货地址";
        } else if (mydata.is_re_de == "delivery") {
            mydata.title = "发货地址";
        }
    },
    validateAddressInfo: function() {
        var data = this.$scope.states;
        if(!data.name) {
            tool.alert('收货人不能为空！');
            return ;
        }
        if(!data.tel) {
            tool.alert('电话不能为空！');
            return ;
        }
        if(!data.zipcode) {
            tool.alert("邮编号不能为空！");
            return ;
        }
        if(!data.provinceName || !data.cityName || !data.countyName) {
            tool.alert('请选择省市区！');
            return ;
        }
        if(!data.addrdetail) {
            tool.alert('详细地址不能为空！');
        }

        var type = $state.getParams().the_value;
        this.service.AddAddress({
            shopId: this.userInfo.shopId,
            token: this.userInfo.token,
            cityId: data.cityId,
            cityName: data.cityName,
            countyId: data.countyId,
            countyName: data.countyName,
            isDefaultAddr: 1,
            isRecvAddr: type == "return" ? 1 : 0,
            provinceId: data.provinceId,
            provName: data.provinceName,
            contactName: data.name,
            contactTel: data.tel,
            shopAddrDetail: data.addrdetail,
            shopAddrRemark: "",
            zipcode: data.zipcode
        });
    },
    AddAddressData: function(result) {
        if(result.status) {
            tool.alert('添加地址成功！');
        } else {
            tool.alert(result.msg);
        }
    }
}