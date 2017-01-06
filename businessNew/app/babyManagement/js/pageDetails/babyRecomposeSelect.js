require('../../../../public/lib/zepto.min.js');
require('!style!css!sass!../../scss/pageDetails/babyRecomposeSelect.scss');

var Vue = require('../../../../public/lib/vue.js');
var text = require('../../view/pageDetails/pages/babyRecomposeSelect.html');
var $state = require('../../../../public/component/$state.js');
var tool = require('../../../../public/component/toollib.js');
var BabySelectService = require('./babyRecomposeSelectService.js');

module.exports = {
    init: function ($el) {
        this.params = $state.getParams();
        this.$el = $el || $(document.body);
        this.service = new BabySelectService(this);
        this.render();
        this.initVue();
        this.service.fetchBabyType(0, 0);
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            items: [],
            dataClassification: [],
            listZhi: [],
            show: -1,
            N: [
                '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', "十一", "十二", "十三", "十四"
            ]
        };
        this.vue = new Vue({
            el: '.babyRecomposeSelect_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                affirm: function () {
                    self.affirm();
                },
                active: function (index) {
                    self.active(index);
                },
                listActive: function (index, key, keyList) {
                    self.listActive(index, key, keyList);
                }
            }
        });
    },
    goBack: function () {
        var params = $state.getItem(this.params.locationHash);
        params.params.isRefresh = false;
        tool.back();
    },
    affirm: function () {
        var params = $state.getItem(this.params.locationHash);
        params.params.isRefresh = false;
        var listLength = this.$scope.listZhi.length;
        var dataClassLength = this.$scope.dataClassification.length;
        var newArray = [];
        if (listLength == dataClassLength) {
            for (var i in this.$scope.listZhi) {
                newArray.push({
                    name: this.$scope.dataClassification[i][this.$scope.listZhi[i]].name,
                    categoryId: this.$scope.dataClassification[i][this.$scope.listZhi[i]].categoryId
                });
            }
            $state.emit('type', newArray);
            tool.back();
        } else {
            tool.alert("还有一级没选择", 1000);
        }
    },
    active: function (index) {
        this.$scope.show = index;
    },
    listActive: function (index, key, keyList) {
        this.service.fetchBabyType(index, key);
        this.$scope.show = -1;
        this.$scope.listZhi.push(keyList);
        for (var i = 0; i <= this.$scope.listZhi.length; i++) {
            if (key == 0) {
                this.$scope.listZhi.splice(1, this.$scope.listZhi.length);
                this.$scope.listZhi.splice(key, 1);
                this.$scope.listZhi.splice(key, 1, keyList);
            } else {
                this.$scope.listZhi.splice(key, 1);
                this.$scope.listZhi.splice(key, 1, keyList);
            }
        }
    },
    changeBabySelectTypeCallback: function (result, index) {
        var self = this;
        this.$scope.items = [];
        if (result.status && result.data) {
            $.each(result.data, function (index, item) {
                self.$scope.items.push({
                    name: item.categoryName,
                    categoryId: item.categoryId
                });
            });
        }
        this.$scope.dataClassification.splice(parseInt(index) + 1, this.$scope.dataClassification.length);
        if (this.$scope.items.length > 0) {
            this.$scope.dataClassification.push(this.$scope.items);
        }

    }
};