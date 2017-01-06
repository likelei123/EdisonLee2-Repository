require('../../../../public/lib/zepto.min.js');
require('!style!css!sass!../../scss/pageDetails/babyRecomposeRelease.scss');

var Vue = require('../../../../public/lib/vue.js');
var text = require('../../view/pageDetails/babyRecomposeRelease.html');
var $state = require('../../../../public/component/$state.js');
var tool = require('../../../../public/component/toollib.js');

var babyReleaseService = require('./babyRecomposeReleaseService.js');

var scope = null;
window.b_loadImageCallback = function (ops) {
    tool.imgFileUploads(ops, function (urls) {
        for (var i = 0; i < urls.length; i++) {
            scope.$scope.imagesUrl.push(urls[i]);
        };
    });
};
module.exports = scope = {
    init: function ($el) {
        var params = $state.getParams();
        if (params.isRefresh) {
            this.$el = $el || $(document.body);
            this.service = new babyReleaseService(this);
            this.render();
            this.initVue();
            this.selectKey(); //选择类目  
        }
        this.babyProperty(); //宝贝属性
        this.babyStandard(); //宝贝规格
        this.purchaseText(); //购买须知
        this.babyDetails(); //宝贝详情
        this.shopClassify(); //店铺自分类
        this.merchandiseInfoWay();
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            distributionStatus: false,
            token: '',
            shopId: '',
            selectArray: [], //选择类别返回值
            categoryId: '',
            property: false,
            newAttribute: [], //宝贝属性返回值
            attributeId: [],
            shopName: '', //商品名称
            distribution: '', //配送费用
            imagesUrl: [],
            upImagesUrl: true,
            copyreaderStatus: false, //宝贝规格状态
            standardContent: [], //宝贝规格返回的值
            standardContentImg: [], //宝贝规格返回的图片值
            purchaseNotes: false, //购买须知状态
            purchaseNotesContent: '', //购买须知返回值
            descriptionStatus: false, //宝贝描述状态
            descriptionStatusContent: '', //宝贝描述返回的值
            shopClassify: false, //店铺自分类状态
            shopClassifyContent: [], //店铺自分类返回值
            imgIndexArray: [], //SKU关联商品图片() 数组
            merchandiseSkus: [], //商品规格表
            isOutOfStock: 1, //上架  或者下架
            merchandiseInfo: [], //提交属性格式
            isStandardStatus: true, //选择规格界面跳转的状态值
            isPurchaseTextStatus: true, //购买须知界面跳转的状态值
            isBabyDetailsStatus: true, //宝贝详情跳转的状态值
            isStoreClassStatus: true //自分类界面跳转的状态值
        };
        this.vue = new Vue({
            el: '.babyRecomposeRelease_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                onEnter: function (url) {
                    self.onEnter(url);
                },
                clearImage: function (index) {
                    self.clearImage(index);
                },
                putaway: function () {
                    self.putaway()
                },
                soldOut: function () {
                    self.soldOut()
                },
                purchaseNotesAction: function (url) { //购买须知 判断跳转
                    self.purchaseNotesAction(url);
                },
                classificationAction: function (url) { //店铺自分类 判断跳转
                    self.classificationAction(url);
                }    
            },
            watch: {
                imagesUrl: function (curVal, oldVal) {
                    if (curVal.length >= 6) {
                        self.$scope.upImagesUrl = false;
                    } else {
                        self.$scope.upImagesUrl = true;
                    };
                },
                selectArray: function (curVal, oldVal) {
                    if (curVal !== oldVal) {
                        self.$scope.property = false;
                        self.$scope.isStandardStatus = true;
                        self.$scope.isPurchaseTextStatus = true;
                        self.$scope.isBabyDetailsStatus = true;
                        self.$scope.isStoreClassStatus = true;
                        self.$scope.purchaseNotes = false;
                        self.$scope.descriptionStatus = false;
                        self.$scope.shopClassify = false;
                        self.$scope.copyreaderStatus = false;
                    } else {
                        self.$scope.isStandardStatus = false;
                        self.$scope.isPurchaseTextStatus = false;
                        self.$scope.isBabyDetailsStatus = false;
                        self.$scope.isStoreClassStatus = false;
                    }
                }
            }
        });
    },
    clearImage: function (index) {
        this.$scope.imagesUrl.splice(index, 1);
    },
    goBack: function () {
        tool.back();
    },
    onEnter: function (url) {
        tool.go(url, {
            categoryId: this.$scope.categoryId,
            attributeId: this.$scope.attributeId,
            imagesUrl: this.$scope.imagesUrl,
            locationHash: window.location.hash,
            isRefresh: true, //跳转状态值
            isStandardStatus: this.$scope.isStandardStatus, //跳转状态值
            isBabyDetailsStatus: this.$scope.isBabyDetailsStatus //跳转状态值

        });
    },
    purchaseNotesAction: function (url) {
        var selectArray = this.$scope.selectArray;
        if (selectArray.length == 0) {
            tool.alert("请先选择类目");
        } else {
            tool.go(url, {
                categoryId: this.$scope.categoryId,
                imagesUrl: this.$scope.imagesUrl,
                locationHash: window.location.hash,
                isPurchaseTextStatus: this.$scope.isPurchaseTextStatus //跳转状态值
            });
        };
    },
    classificationAction: function (url) {
        var selectArray = this.$scope.selectArray;
        if (selectArray.length == 0) {
            tool.alert("请先选择类目");
        } else {
            tool.go(url, {
                categoryId: this.$scope.categoryId,
                imagesUrl: this.$scope.imagesUrl,
                locationHash: window.location.hash,
                isStoreClassStatus: this.$scope.isStoreClassStatus //跳转状态值
            });
        };
    },
    selectKey: function () {
        var self = this;
        $state.on('type', function (index) { // 选择类目
            self.$scope.selectArray = [];
            if (index[0].name == '零售类') {
                self.$scope.distributionStatus = true;
            } else {
                self.$scope.distributionStatus = false;
                self.$scope.distribution = 13;
            };
            for (var i in index) {
                self.$scope.selectArray.push(index[i].name);
            };
            self.$scope.categoryId = index[index.length - 1].categoryId; //获取的是最后一级的ID值
            var result = self.$scope.merchandiseInfo;
            if ($.isArray(result) && result.length > 0) {
                result[0].categoryId = self.$scope.categoryId;
            };
        });
        var token = tool.getUserInfo();
        if (token.token == '') {
            tool.alert("没有TOKEN");
            tool.go('#/index');
            self.$scope.token = '';
            self.$scope.shopId = '';
        } else {
            self.$scope.token = token.token;
            self.$scope.shopId = token.shopId;
        }
        for (var i in this.$scope.imagesUrl) {
            this.$scope.imgIndexArray.push(i);
        }
    },
    babyProperty: function () { //宝贝属性
        var categoryId = this.$scope.categoryId;
        if (categoryId == '') {} else {
            this.service.getGoodsType(this.$scope.categoryId);
            this.$scope.property = true;
        }
    },
    changebabyPropertyTypeCallback: function (result) {
        var self = this;
        this.$scope.attributeId = [];
        if (result.status && result.data) {
            $.each(result.data, function (index, item) {
                self.$scope.attributeId.push({
                    attribute_id: item.attribute_id,
                    attribute_name: item.attribute_name
                });
            });
        };
    },
    babyStandard: function () { //宝贝规格 返回的信息
        var self = this;
        $state.on('babyStandardCommodityData', function (index) {
            self.$scope.standardContent = [];
            if (index.length > 0) {
                self.$scope.copyreaderStatus = true;
                self.$scope.standardContent.push(index);
            } else {
                self.$scope.copyreaderStatus = false;
            }
        });
        $state.on('babyStandardImgsData', function (index) {
            self.$scope.standardContentImg = [];
            $.each(index, function (index, item) {
                self.$scope.standardContentImg.push(item);
            })
        });
        $state.on('isStandardStatus', function (index) {
            self.$scope.isStandardStatus = index;
        });

    },
    purchaseText: function () { //购买须知返回信息
        var self = this;
        $state.on('purchaseText', function (index) {
            if (index.length > 0) {
                self.$scope.purchaseNotes = true;
                self.$scope.purchaseNotesContent = index;
                var result = self.$scope.merchandiseInfo;
                if ($.isArray(result) && result.length > 0) {
                    result[0].merchandiseBlurb = self.$scope.purchaseNotesContent;
                }
            } else {
                self.$scope.purchaseNotes = false;
            };
        });
        $state.on('isPurchaseTextStatus', function (index) {
            self.$scope.isPurchaseTextStatus = index;
        });
    },
    babyDetails: function () { //宝贝描述
        var self = this;
        $state.on('babyDetails', function (index) {
            if (index.length > 0) {
                self.$scope.descriptionStatus = true;
                self.$scope.descriptionStatusContent = JSON.stringify(index);
            } else {
                self.$scope.descriptionStatus = false;
            };
        });
        $state.on('isBabyDetailsStatus', function (index) {
            self.$scope.isBabyDetailsStatus = index;
        });
    },
    shopClassify: function () { //店铺自分类
        var self = this;
        $state.on('storeClass', function (index) {
            self.$scope.shopClassifyContent = [];
            if (index.length > 0) {
                self.$scope.shopClassify = true;
                self.$scope.shopClassifyContent.push(index[0]);
                var result = self.$scope.merchandiseInfo;
                if ($.isArray(result) && result.length > 0) {
                    result[0].customCategoryId = index[0].categoryId;
                }
            } else {
                self.$scope.shopClassify = false;
            };
        });
        $state.on('isStoreClassStatus', function (index) {
            self.$scope.isStoreClassStatus = index;
        });
    },
    putaway: function () { //上架
        this.$scope.isOutOfStock = 1;
        var token = this.$scope.token;
        var shopId = this.$scope.shopId;
        var merchandiseInfo = this.$scope.merchandiseInfo[0];
        var selectArray = this.$scope.selectArray;
        var property = this.$scope.property;
        var shopName = this.$scope.shopName;
        var copyreaderStatus = this.$scope.copyreaderStatus;
        var descriptionStatus = this.$scope.descriptionStatus;
        var shopClassify = this.$scope.shopClassify;
        if (selectArray.length !== 0 && shopName !== '' && property && copyreaderStatus && descriptionStatus && shopClassify) {
            console.log(JSON.stringify(merchandiseInfo));
            this.service.addBabyType(token, shopId, 1, JSON.stringify(merchandiseInfo));
        } else {
            tool.alert("请填写完整");
        };
    },
    addMerchandiseCallback: function (result) {
        var self = this;
        if (result.status && result.data) {
            tool.alert("添加成功");
            tool.back();
        } else {
            tool.alert("添加失败");
        }
    },
    soldOut: function () { //加入仓库
        this.$scope.isOutOfStock = 0;
        var token = this.$scope.token;
        var shopId = this.$scope.shopId;
        var merchandiseInfo = this.$scope.merchandiseInfo[0];
        var selectArray = this.$scope.selectArray;
        var property = this.$scope.property;
        var shopName = this.$scope.shopName;
        var distribution = this.$scope.distribution;
        var copyreaderStatus = this.$scope.copyreaderStatus;
        var descriptionStatus = this.$scope.descriptionStatus;
        var shopClassify = this.$scope.shopClassify;
        if (selectArray.length !== 0 && shopName !== '' && distribution !== '' && property && copyreaderStatus && descriptionStatus && shopClassify) {
            this.service.addBabyType(token, shopId, 1, JSON.stringify(merchandiseInfo));
        } else {
            tool.alert("请填写完整");
        };
    },
    merchandiseInfoWay: function () {
        var self = this;
        if (this.$scope.shopClassifyContent.length > 0) {
            var customCategoryId = this.$scope.shopClassifyContent[0].categoryId; //商品类型ID (店铺自定义)
        };
        var merchandiseBlurb = this.$scope.purchaseNotesContent; //购买须知
        var isOutOfStock = this.$scope.isOutOfStock; //商品上下架 1 or 0
        var imgIndex = this.$scope.imgIndexArray; //SKU关联商品图片()
        var merchandiseSkus = this.$scope.merchandiseSkus; //商品规格表
        this.$scope.merchandiseInfo.push({
            categoryId: '',
            categoryName: '',
            customCategoryId: customCategoryId,
            details: '', //商品规格选择图片后的详情信息
            deliveryFee: '',
            imgs: [
                //获取图片
            ],
            isOutOfStock: isOutOfStock,
            merchandiseBlurb: '',
            merchandiseName: '',
            merchandiseSkus: merchandiseSkus, //商品规格表
        });
        this.$scope.merchandiseInfo[0].merchandiseName = this.$scope.shopName; //商品名称
        this.$scope.merchandiseInfo[0].deliveryFee = this.$scope.distribution; //费用
        this.$scope.merchandiseInfo[0].categoryName = this.$scope.selectArray[this.$scope.selectArray.length - 1];
        this.$scope.merchandiseInfo[0].details = JSON.stringify(this.$scope.standardContentImg); // //商品规格选择图片后的详情信息
        var descriptionStatusContent = this.$scope.descriptionStatusContent;
        self.$scope.merchandiseInfo[0].details = descriptionStatusContent;
        this.$scope.merchandiseInfo[0].imgs = [];
        var imagesUrl = this.$scope.imagesUrl; //获取图片
        if (imagesUrl.length !== 0) {
            $.each(imagesUrl, function (index, item) {
                self.$scope.merchandiseInfo[0].imgs.push({
                    imgsIndex: ++index,
                    imgsUrl: item,
                    isManImg: 0
                });
            });
        } else {
            this.$scope.merchandiseInfo[0].imgs.push([]);
        }
        this.$scope.merchandiseInfo[0].imgs[0].isManImg = 1; //默认第一张为1 
        this.$scope.merchandiseInfo[0].merchandiseSkus = [];
        var standardContent = this.$scope.standardContent; //商品规格;
        for (var i in standardContent[0]) {
            this.$scope.merchandiseInfo[0].merchandiseSkus.push({
                attrSpec: [{
                    attributeId: standardContent[0][i].attributeId,
                    valueValID: standardContent[0][i].Id
                }],
                imgIndex: '',
                linePrice: standardContent[0][i].shitil,
                onLinePrice: standardContent[0][i].pingtai,
                qty: standardContent[0][i].kucun,
                skuCode: standardContent[0][i].shangpin,
                skuStatus: 1
            });
        };
        var standardContentImg = this.$scope.standardContentImg; //获得的规格图片参数
        for (var i in standardContentImg) {
            for (var n in self.$scope.merchandiseInfo[0].merchandiseSkus) {
                if (i == n) {
                    $.each(standardContentImg, function (index, item) {
                        self.$scope.merchandiseInfo[0].merchandiseSkus[n].imgIndex = JSON.stringify(++item);
                    })

                }
            }
        }
    }
};