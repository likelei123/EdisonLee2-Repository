require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/enter_map.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var $state = require("../../../public/component/$state");
var text = require("../view/enter_map.html");
var city_text = require("../view/enter_city.html");
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.render();
        this.initmap();
        this.$scope = {
            states: {
                city:"成都"
            },
            items: {

            }
        };
        this.initVue();
    },
    render: function () {
        var $html = $(text);
        this.$el.html($(text));
    },
    initVue: function () {
        var self = this;
        this.vue = new Vue({
            el: ".enter-map",
            data: this.$scope,
            ready: function () {
              $state.on("city", function (param) {
                   self.$scope.states.city = param;
                });
            },
            methods: {
                onGoback: function () {
                    self.onGoback();
                },
                onGolist: function () {
                    self.onGolist();
                },
                onEntercity: function () {
                    self.onEntercity();
                }
            },

        })
    },
    onGoback: function () {
        tool.back();
    },
    onGolist: function () {
        var point = this.map.getCenter();
        tool.go("#/enter_list", point);
    },
    initmap: function () {
        var map = this.map = new BMap.Map("ismap"); // 创建地图实例  
        var point = new BMap.Point(104.072222, 30.663465); // 创建点坐标  
        map.centerAndZoom(point, 15);
        var gcinit = new BMap.Geocoder();
        var inintpoint = map.getCenter();
        gcinit.getLocation(inintpoint, function (jd) {
            var street = jd.addressComponents.street;
            $(".street_text").find("i").html(street)
        })
        map.addEventListener("moveend", function () {
            var centerpoint = map.getCenter();
            // centerpoint= {lng: 104.073659, lat: 30.621601}
            var gc2 = new BMap.Geocoder();
            gc2.getLocation(centerpoint, function (jd) {
                var street = jd.addressComponents.street;
                $(".street_text").find("i").html(street)
            })
        })
    },
    onEntercity: function () {
        tool.go("#/enter_city")
    },

}