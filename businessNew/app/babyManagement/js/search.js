require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/search.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/pages/search.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();
        this.initVue();
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {

        };
        this.vue = new Vue({
            el: '.search_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                }
            }
        });
    },
    goBack: function () {
        tool.back();
    }
};