require('../../../../public/lib/zepto.min.js');
require('!style!css!sass!../../scss/pageDetails/babyRecomposeStandard.scss');

var Vue = require('../../../../public/lib/vue.js');
var text = require('../../view/pageDetails/pages/babyRecomposeStandard.html');
var $state = require('../../../../public/component/$state.js');
var tool = require('../../../../public/component/toollib.js');

var BabySelectService = require('./babyRecomposeStandardService.js');

module.exports = {
    init: function ($el) {
        var refreshStatus = $state.getParams();
        if (refreshStatus.isStandardStatus) {
            this.$el = $el || $(document.body);
            this.service = new BabySelectService(this);
            this.render();
            this.initVue();
            this.attributeId();
            this.getGoodsEach(); //递归遍历
        }
        this.initRegisterEvent();
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            bacth: false,
            maCont: false,
            dataIndexValue: '', //获取标题的下标值
            listArray: [],
            titleData: [], //标题数据
            allListData: [], //获取的全部数据
            valude: '',
            shitilVal: '',
            pingtaiVal: '',
            kucunVal: '',
            shangpinVal: '',
            accomplishColor: false,
            listArrayCheck: [],
            chooseImgAndId: [],
            listArrayAnd: [],
            chooseImgZhi: [],
            isStandardStatus: false,
            currentIndex: 0 //递归变量
        };
        this.vue = new Vue({
            el: '.babyRecomposeStandard_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                addColumn: function (index) {
                    self.addColumn(index);
                },
                conceal: function () {
                    self.conceal();
                },
                save: function () {
                    self.save();
                },
                listActive: function (secondIndex, index) {
                    self.listActive(secondIndex, index);
                },
                skip: function (titleIndex, index) {
                    self.skip(titleIndex, index);
                },
                choose: function (titleIndex, index) {
                    self.choose(titleIndex, index);
                },
                batchList: function () {
                    self.batchList();
                },
                success: function () {
                    self.success();
                },
                batchHide: function () {
                    self.batchHide();
                },
                accomplish: function () {
                    self.accomplish();
                }

            }
        });
    },
    goBack: function () {
        $state.emit('isStandardStatus', this.$scope.isStandardStatus);
        tool.back();
    },
    addColumn: function (index) {
        this.$scope.maCont = true;
        this.$scope.dataIndexValue = index;
    },
    conceal: function () {
        this.$scope.maCont = false;
    },
    save: function () {
        var text = this.$scope.valude.trim();
        var params = $state.getParams();
        var userInfo = tool.getUserInfo();
        var dataIndexValue = this.$scope.dataIndexValue;
        if (text == '' || text == undefined) {
            tool.alert("请输入");
        } else {
            this.$scope.maCont = false;
            this.service.addAttrValueType(params.attributeId[dataIndexValue].attribute_id, this.$scope.valude, userInfo.shopId);
        };
    },
    changeaddAttrValueTypeCallback: function (result) {
        if (result.status && result.data) {
            var dataIndexValue = this.$scope.dataIndexValue;
            if (this.$scope.allListData[dataIndexValue]) {
                this.$scope.allListData[dataIndexValue].push({
                    valueId: result.data.valueId,
                    name: this.$scope.valude,
                    status: false,
                    check: false,
                    shitil: '',
                    pingtai: '',
                    kucun: '',
                    shangpin: ''
                });

            } else {
                this.$scope.allListData.push([{
                    valueId: result.data.valueId,
                    name: this.$scope.valude,
                    status: false,
                    check: false,
                    shitil: '',
                    pingtai: '',
                    kucun: '',
                    shangpin: ''
                }]);

            }
            this.$scope.valude = '';
            console.log(JSON.stringify(this.$scope.allListData));
        }
    },
    listActive: function (secondIndex, index) {
        this.$scope.allListData[secondIndex][index].status = !this.$scope.allListData[secondIndex][index].status;
    },
    skip: function (titleIndex, index) {
        tool.go('#/imgRecomposeSwitcher', {
            valueId: this.$scope.allListData[titleIndex][index].Id,
            imgArray: $state.getParams().imagesUrl,
            locationHash: window.location.hash,
            isStandardStatus: false,
        });
    },
    choose: function (titleIndex, index) {
        var shitilVal = this.$scope.allListData[titleIndex][index].shitil;
        var pingtaiVal = this.$scope.allListData[titleIndex][index].pingtai;
        var kucunVal = this.$scope.allListData[titleIndex][index].kucun;
        var shitilVal = this.$scope.allListData[titleIndex][index].shangpin;
        if (shitilVal !== '' && pingtaiVal !== '' && kucunVal !== '' && shitilVal !== '') {
            this.$scope.listArrayCheck = [];
            this.$scope.allListData[titleIndex][index].check = !this.$scope.allListData[titleIndex][index].check;
            var self = this;
            for (var i in this.$scope.allListData[titleIndex]) {
                if (self.$scope.allListData[titleIndex][i].check) {
                    self.$scope.listArrayCheck.push(1);
                } else {
                    self.$scope.accomplishColor = false;
                    self.$scope.listArrayCheck.push(0);
                };
            };
            if (this.$scope.listArrayCheck.indexOf(1) > -1) {
                self.$scope.accomplishColor = true;
            } else {
                self.$scope.accomplishColor = false;
            };
        } else {
            tool.alert("不能为空");
        };
    },
    batchList: function () {
        this.$scope.bacth = true;
    },
    success: function () {
        var shitilVal = this.$scope.shitilVal;
        var pingtaiVal = this.$scope.pingtaiVal;
        var kucunVal = this.$scope.kucunVal;
        var shangpin = this.$scope.shangpin;
        if (shitilVal !== '' && pingtaiVal !== '' && kucunVal !== '' && shangpin !== '') {
            for (var i in this.$scope.allListData) {
                for (var index in this.$scope.allListData[i]) {
                    this.$scope.allListData[i][index].shitil = this.$scope.shitilVal;
                    this.$scope.allListData[i][index].pingtai = this.$scope.pingtaiVal;
                    this.$scope.allListData[i][index].kucun = this.$scope.kucunVal;
                    this.$scope.allListData[i][index].shangpin = this.$scope.shangpinVal;
                };
            };
            this.$scope.bacth = false;
        } else {
            tool.alert("不能为空", 1000);
        };

    },
    batchHide: function () {
        this.$scope.bacth = false;
    },
    attributeId: function () {
        var self = this;
        var params = $state.getParams();
        self.$scope.titleData = [];
        $.each(params.attributeId, function (index, item) {
            self.$scope.titleData.push(
                item.attribute_name
            );
        });
    },
    getGoodsEach: function () { //递归遍历  防止循序出错
        var self = this;
        var userInfo = tool.getUserInfo();
        var params = $state.getParams();
        if (this.$scope.currentIndex >= params.attributeId.length) {
            return;
        };
        var attribute_id = params.attributeId[this.$scope.currentIndex].attribute_id;
        self.service.fetchBabyType(
            attribute_id,
            userInfo.shopId
        );
    },
    changebabyStandardTypeCallback: function (result) {
        var arr = [];
        var self = this;
        var params = $state.getParams();
        var allListDataLength = this.$scope.allListData;
        if (result.status && result.data) {
            $.each(result.data, function (index, item) {
                arr.push({
                    Id: item.valueId,
                    name: item.valueVal,
                    attributeId: item.attributeId,
                    status: false,
                    check: false,
                    shitil: '',
                    pingtai: '',
                    kucun: '',
                    shangpin: ''
                });
            });
            this.$scope.allListData.push(arr);
            this.$scope.currentIndex++;
            this.getGoodsEach();
        } else {
            this.$scope.currentIndex++;
            this.getGoodsEach();
        }
        // this.$scope.allListData.push(arr);
    },
    accomplish: function () {
        var self = this;
        if (this.$scope.accomplishColor) {
            this.$scope.listArrayAnd = [];
            this.$scope.chooseImgZhi = [];
            for (var i = 0; i <= self.$scope.allListData.length; i++) {
                if (self.$scope.allListData[i]) {
                    for (var item = 0; item <= self.$scope.allListData[i].length; item++) {
                        if (self.$scope.allListData[i][item] && self.$scope.allListData[i][item].check) {
                            self.$scope.listArrayAnd.push(self.$scope.allListData[i][item]);
                        };
                    };
                };
            };
            tool.alert("添加成功");
            for (var i = 0; i <= self.$scope.listArrayAnd.length; i++) {
                if (self.$scope.listArrayAnd[i]) {
                    for (var item = 0; item <= self.$scope.chooseImgAndId.length; item++) {
                        if (self.$scope.chooseImgAndId[item]) {
                            if (self.$scope.chooseImgAndId[item].Id == self.$scope.listArrayAnd[i].Id) {
                                self.$scope.chooseImgZhi.push(self.$scope.chooseImgAndId[item].ActiveCheck);
                            };
                        };
                    };
                };
            };
            $state.emit('babyStandardCommodityData', self.$scope.listArrayAnd);
            $state.emit('babyStandardImgsData', self.$scope.chooseImgZhi);
            $state.emit('isStandardStatus', self.$scope.isStandardStatus);
            tool.back();
        } else {
            tool.alert("请选择");
        };
    },
    initRegisterEvent: function () {
        var self = this;
        $state.on('selectBabyFirstImage', function (imgId) {
            if (self.$scope.chooseImgAndId.length > 0) {
                for (var i in self.$scope.chooseImgAndId) {
                    if (self.$scope.chooseImgAndId[i].Id == imgId[0].Id) {
                        self.$scope.chooseImgAndId[i].ActiveCheck = imgId[0].ActiveCheck;
                    } else {
                        self.$scope.chooseImgAndId.push(imgId);
                        return false;
                    };
                };
            } else {
                self.$scope.chooseImgAndId.push(imgId[0]);
            };
        });
    }
};