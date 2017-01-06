require('../../../public/lib/zepto.min.js');
require('!style!css!sass!../scss/babyDetails.scss');

var Vue = require('../../../public/lib/vue.js');
var text = require('../view/pages/babyDetails.html');
var $state = require('../../../public/component/$state.js');

var tool = require('../../../public/component/toollib.js');

window.d_detailsImageCallback = function (ops) {
    tool.imgFileUploads(ops, function (urls) {
        for (var i = 0; i < urls.length; i++) {
            scope.$scope.items.push({
                description: "",
                imageUrl: urls[i]
            });
        }
    });
}
var scope = null
module.exports = scope = {
    init: function ($el) {
        var refreshStatus = $state.getParams();
        if (refreshStatus.isBabyDetailsStatus) {
            this.$el = $el || $(document.body);
            this.render();
            this.initVue();
          
        };
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.$scope = {
            items: [],
            imgText: '',
            isBabyDetailsStatus: false
        };
        this.vue = new Vue({
            el: '.details_main',
            data: this.$scope,
            methods: {
                goBack: function () {
                    self.goBack();
                },
                compile: function (compile) {
                    self.compile(compile);
                },
                success: function () {
                    self.success();
                }
            }
        });
    },
    goBack: function () {
        $state.emit('isBabyDetailsStatus', this.$scope.isBabyDetailsStatus);
        tool.back();
    },
    compile: function (index) {
        this.$el.find('textarea').focus();
    },
    success: function () {
        console.log(JSON.stringify(this.$scope.items));
        $state.emit('babyDetails', this.$scope.items);
        $state.emit('isBabyDetailsStatus', this.$scope.isBabyDetailsStatus);
        tool.back();
    }
}

;