require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/purchaseText.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/pages/purchaseText.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

module.exports = {
    init: function ($el) {
        var refreshStatus = $state.getParams();
        console.log(refreshStatus.isPurchaseTextStatus);
        if (refreshStatus.isPurchaseTextStatus) {
            this.$el = $el || $(document.body);
            this.render();
            this.initVue();
        }
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            purchaseNotes: '',
            imgText: '',
            isPurchaseTextStatus: false
        };
        this.vue = new Vue({
            el: '.purchase_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                save: function () {
                    self.save();
                }
            }
        });
    },
    goBack: function () {
        $state.emit('isPurchaseTextStatus', this.$scope.isPurchaseTextStatus);
        tool.back();
    },
    save: function () {
        $state.emit('purchaseText', this.$scope.purchaseNotes);
        $state.emit('isPurchaseTextStatus', this.$scope.isPurchaseTextStatus);
        tool.back();
    }

};