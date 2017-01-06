require('../../../../public/lib/zepto.min.js');
require('!style!css!sass!../../scss/pageDetails/imgRecomposeSwitcher.scss');

var Vue = require('../../../../public/lib/vue.js');
var text = require('../../view/pageDetails/pages/imgRecomposeSwitcher.html');
var $state = require('../../../../public/component/$state.js');
var tool = require('../../../../public/component/toollib.js');

module.exports = {
    init: function ($el) {
        this.params = $state.getParams();
        this.$el = $el || $(document.body);
        this.render();
        this.initVue();
        this.imgSwitcherArray();
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            imgNewArray: [],
            ActiveCheck: -1,
            accomplishColor: false,
            Id: '',
            imgSwitcherArray: []
        };
        this.vue = new Vue({
            el: '.imgRecomposeSwitcher_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                makeSure: function (index) {
                    self.makeSure(index);
                },
                success: function () {
                        self.success();
                    }
                    // onEnter: function (url) {
                    //     self.onEnter(url);
                    // }
            }
        });
    },
    goBack: function () {
        var params = $state.getItem(this.params.locationHash);
        params.params.isStandardStatus = false;
        tool.back();
    },
    makeSure: function (index) {
        this.$scope.ActiveCheck = index;
        this.$scope.imgNewArray[index].check = !this.$scope.imgNewArray[index].check;
        this.$scope.accomplishColor = true;
    },
    success: function () {
        var self = this;
        this.$scope.Id = $state.getParams().valueId;
        this.$scope.imgSwitcherArray.push({
            Id: this.$scope.Id,
            ActiveCheck: this.$scope.ActiveCheck
        });
        if (this.$scope.accomplishColor) {
            $state.emit('selectBabyFirstImage', self.$scope.imgSwitcherArray); //传送下标值 和ID 号
            var params = $state.getItem(this.params.locationHash);
            params.params.isStandardStatus = false;
            tool.back();
        } else {
            tool.alert("请选择或者返回上一级", 1000);
        }
    },
    imgSwitcherArray: function () { //img url地址
            var self = this;
            $.each($state.getParams().imgArray, function (index, items) {
                self.$scope.imgNewArray.push({
                    img: items
                });
            })
        }
        // onEnter: function (url) {
        //     tool.go(url);
        // }
};