require('../../../../public/lib/zepto.min.js');
require('!style!css!sass!../../scss/pageDetails/storeRecomposeClass.scss');

var Vue = require('../../../../public/lib/vue.js');
var text = require('../../view/pageDetails/pages/storeRecomposeClass.html');
var $state = require('../../../../public/component/$state.js');
var tool = require('../../../../public/component/toollib.js');

var storeClassService = require('./storeRecomposeClassService.js');
module.exports = {
    init: function ($el) {
        var refreshStatus = $state.getParams();
        if (refreshStatus.isStoreClassStatus) {
            this.$el = $el || $(document.body);
            this.service = new storeClassService(this);
            this.render();
            this.initVue();
        }
        this.storClass();
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            reveal: false,
            valude: '',
            valArray: [],
            affirmChoose: [],
            categoryId: '',
            isStoreClassStatus: false
        };
        this.vue = new Vue({
            el: '.storeRecomposeClass_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                storeActive: function () {
                    self.storeActive();
                },
                conceal: function () {
                    self.conceal();
                },
                success: function () {
                    self.success();
                },
                choose: function (index) {
                    self.choose(index);
                }

            }
        });
    },
    goBack: function () {
        $state.emit('isStoreClassStatus', this.$scope.isStoreClassStatus);
        tool.back();
    },
    storeActive: function () {
        this.$scope.reveal = true;
    },
    conceal: function () {
        this.$scope.reveal = false;
    },
    success: function () {
        var text = this.$scope.valude[0].trim();
        if (text == '' || text == undefined) {
            alert("请输入");
        } else {
            // if (this.$scope.valArray[0].indexOf(text) == 1) {
            //     alert("请重新输入");
            // } else {
            this.$scope.reveal = false;
            this.$scope.valArray.push({
                categoryId: this.$scope.categoryId,
                categoryName: this.$scope.valude
            });
            this.$scope.valude = '';
            // }
        }
    },
    choose: function (index) {
        this.$scope.affirmChoose = this.$scope.valArray;
        $state.emit('storeClass', this.$scope.affirmChoose);
        $state.emit('isStoreClassStatus', this.$scope.isStoreClassStatus);
        tool.back();

    },
    storClass: function () {
        var shopId = tool.getUserInfo().shopId;
        this.service.fetchBabyType(shopId);
    },
    changeStoreClassCallback: function (result) {
        var self = this;
        this.$scope.valArray = [];
        if (result.status && result.data) {
            $.each(result.data, function (index, item) {
                self.$scope.valArray.push({
                    categoryId: item.categoryId,
                    categoryName: item.categoryName
                });
                self.$scope.categoryId = self.$scope.valArray[0].categoryId;
            })
        }

    }

};