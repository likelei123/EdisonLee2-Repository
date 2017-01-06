require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/particulars_leave.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/subpage/particulars_leave.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

var moduleText = require('../view/subpage/particulars_leave_cap.html');
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();
        this.initVue();
    },
    render: function () {
        var $html = $(text);
        $html.append(moduleText);
        this.$el.html($html);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            whole: false,
            contentShow: false,
            item: []
        };
        this.vue = new Vue({
            el: '.subpage_particulars_leave',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                active: function () {
                    self.active();
                },
                affirm: function () {
                    self.affirm();
                },
                openActive: function () {
                    self.openActive();
                }
            }
        })
    },
    goBack: function () {
        tool.back();
    },
    active: function () {
        this.$scope.whole = true;
    },
    affirm: function () {
        this.$scope.whole = false;
    },
    openActive: function () {
        this.$scope.contentShow = !this.$scope.contentShow;
    }

}