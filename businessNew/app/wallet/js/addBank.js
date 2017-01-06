require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/addBank.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/pages/addBank.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();
        this.initVue();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
    },
    initVue: function () {
        var self = this;
        this.$scope = {};
        this.vue = new Vue({
            el: '.addBank_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                onEnter: function (url) {
                    self.onEnter(url);
                }
            }
        })
    },
    goBack: function () {
        tool.back();
    },
    onEnter: function (url) {
        tool.go(url);
    }
}