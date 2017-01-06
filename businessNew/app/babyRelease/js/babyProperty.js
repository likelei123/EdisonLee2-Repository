require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/babyProperty.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/pages/babyProperty.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');
var babyPropertyService = require('./babyPropertyService.js');

module.exports = {
    init: function ($el) {
        this.params = $state.getParams();
        var refreshStatus = $state.getParams();
        if (refreshStatus.isBreak) {
            this.$el = $el || $(document.body);
            this.service = new babyPropertyService(this);
            this.render();
            this.initVue();
            this.categryID();
        }
        
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            items: [],
            newAttribute: [],
            breakStatus:false

        };
        this.vue = new Vue({
            el: '.property_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                success: function () {
                    self.success();
                }
            }
        });
    },
    goBack: function () {
        var params = $state.getItem(this.params.locationHash);
        params.params.isBreak = false;
        tool.back();
    },
    categryID: function () {
        this.service.fetchBabyType($state.getParams().categoryId);
    },
    changebabyPropertyTypeCallback: function (result) {
        var self = this;
        this.$scope.items = [];
        if (result.status && result.data) {
            self.$scope.items.push(result.data);
        };
        if (this.$scope.items.length == 0) {
            tool.alert("请选择类目");
        };
    },
    success: function () {
        var params = $state.getItem(this.params.locationHash);
        console.log(JSON.stringify(params));
        var self = this;
        var attributeArray = [];
        for (var i in this.$scope.items[0]) {
            if (this.$scope.items[0][i].attribute_type == '') {
                attributeArray.push(i);
            }
        };
        if (attributeArray.length > 0) {
            tool.alert("所有属性必须填写");
        } else {
            self.$scope.newAttribute = [];
            for (var i in this.$scope.items[0]) {
                self.$scope.newAttribute.push({
                    attribute_id: self.$scope.items[0][i].attribute_id,
                    attributeOld: self.$scope.items[0][i].attribute_name,
                    attributeTypeOld: self.$scope.items[0][i].attribute_type
                });
            };
            $state.emit('property', self.$scope.newAttribute);
            $state.emit('attribute_id', self.$scope.items[0][self.$scope.items[0].length - 1].attribute_id);
            $state.emit('breakStatus',self.$scope.breakStatus);
            tool.back();
            params.params.isRefresh = false;
        };
    }

};