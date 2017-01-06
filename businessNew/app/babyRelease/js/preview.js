require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/preview.scss');
require('!style!css!sass!../../../public/scss/swiper-3.4.0.min.css');

var Vue = require('../../../public/lib/vue.js');
var Swiper = require('../../../public/lib/swiper-3.4.0.jquery.min.js');
var text = require('../view/pages/preview.html');
var $state = require('../../../public/component/$state.js');
var tool = require('../../../public/component/toollib.js');

module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();
        this.initVue();
        this.swiperLun();
        // this.dataValue();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($html);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            dataValue:[]
        };
        this.vue = new Vue({
            el: '.preview_main',
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
    },
    swiperLun: function () {
        $(document).ready(function () {
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                loop: true,
                pagination: '.swiper-pagination',
            });
        });
    }
    // ,
    // dataValue: function () {
    //     this.$scope.dataValue =$state.getParams().merchandiseInfo;
    //     console.log(JSON.stringify(this.$scope.dataValue));
    // }
}