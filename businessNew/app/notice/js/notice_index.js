require("../../../public/lib/zepto.min");
require("!style!css!sass!../scss/notice_index.scss");
var Vue = require("../../../public/lib/vue");
var tool = require("../../../public/component/toollib");
var text = require("../view/notice_index.html");
var $state = require("../../../public/component/$state");
var NoticeIndexService = require('./notice_index_service.js');
module.exports = {
    init: function ($el) {
        this.$el = $el || $(document.body);
        this.userInfo = tool.getUserInfo();
        this.noticeInfo = null;
        this.service = new NoticeIndexService(this);
        this.render();
        this.$scope = {
            states: {
                num: "0"
            },
            data: {
                isReadonly: true,
                isEidterButtonShow: true, //编辑
                isReleaseShow: false, //发布
                isCancelShow: false, //取消
                isEnsureShow: false, //启动
                content: ""
            }
        };
        this.initVue();
        this.service.fetchAnnouncementCheck(this.userInfo.shopId);
    },
    render: function () {
        this.$el.html(text);
    },
    initVue: function () {
        var self = this;
        this.vue = new Vue({
            el: ".notice-index",
            data: self.$scope,
            methods: {
                onGoback: function () {
                    self.onGoback()
                },
                onWrite: function () {
                    self.onWrite()
                },
                onRelease: function () {
                    self.onRelease()
                },
                onCancel: function () {
                    self.onCancel()
                },
                onStart: function () {
                    self.onStart()
                }
            },
            watch: {
                "data.content": function (val, oldval) {
                    self.$scope.states.num = val.length;
                    if (0 <= val.length && val.length < 500) {
                        self.$scope.data.content = val;
                        console.log(val.length)
                    } else {
                        self.$scope.data.isReadonly = true;
                        tool.alert("输入的文字不能超过500字")
                    }
                }
            }
        })
    },
    onGoback: function () {
        tool.back();
    },
    onWrite: function () {
        var d = this.$scope.data;
        d.isReleaseShow = true;
        d.isCancelShow = false;
        d.isEnsureShow = false;
        d.isReadonly = false;
        d.isEidterButtonShow = false;
        this.$el.find('textarea').focus();
    },
    onRelease: function () {
        if (this.noticeInfo) {
            this.service.editAnnouncementRun({
                shopId: this.userInfo.shopId,
                noticeId: this.noticeInfo.shopnoticeId,
                token: this.userInfo.token,
                noticeContent: this.$scope.data.content
            });
        } else {
            this.service.releaseAnnouncementRun({
                shopId: this.userInfo.shopId,
                token: this.userInfo.token,
                title: "",
                content: this.$scope.data.content,
                noticeType: 1
            });
        }
    },
    onCancel: function () {
        console.log(this.noticeInfo.shopnoticeId)
        this.service.updateShopNoticeStatusRun({
            shopId: this.userInfo.shopId,
            noticeId: this.noticeInfo.shopnoticeId,
            noticeStatus: 0,
            token: this.userInfo.token
        });
    },
    onStart: function () {
        this.service.updateShopNoticeStatusRun({
            shopId: this.userInfo.shopId,
            noticeId: this.noticeInfo.shopnoticeId,
            noticeStatus: 1,
            token: this.userInfo.token
        });
    },
    fetchAnnouncementCheckCallback: function (result) {
        console.log(result);
        var d = this.$scope.data;
        if (result.status) {
            if (result.data) {
                this.noticeInfo = result.data;
                // d.isReadonly = false;
                // d.isReleaseShow = true;
                // d.isCancelShow = false;
                // d.isEnsureShow = false;
                // d.isEidterButtonShow = false;
                d.content = result.data.noticeContent;
                if (result.data.noticeType == 0) {
                    d.isReadonly = true;
                    d.isReleaseShow = false;
                    d.isCancelShow = false;
                    d.isEnsureShow = true;
                    d.isEidterButtonShow = true;
                } else if (result.data.noticeType == 1) {
                    d.isReadonly = true;
                    d.isReleaseShow = false;
                    d.isCancelShow = true;
                    d.isEnsureShow = false;
                    d.isEidterButtonShow = true;
                }
            } else {
                this.$scope.data.isEidterButtonShow = true;
                d.isReadonly = true;
                d.isReleaseShow = false;
                //d.isEidterButtonShow = false;
                d.isCancelShow = false;
                d.isEnsureShow = false;
            }

        } else {

            tool.alert(result.msg);
        }
    },
    updateShopNoticeStatusCallback: function (result, noticeType) {
        var d = this.$scope.data;
        if (result.status) {
            if (noticeType == 0) {
                tool.alert('取消公告成功！');
                d.isReadonly = true;
                d.isReleaseShow = false;
                d.isCancelShow = false;
                d.isEnsureShow = true;
                d.isEidterButtonShow = true;
            } else if (noticeType == 1) {
                tool.alert('启动公告成功！');
                d.isReadonly = true;
                d.isReleaseShow = false;
                d.isCancelShow = true;
                d.isEnsureShow = false;
                d.isEidterButtonShow = true;
            }
        } else {
            tool.alert(result.msg);
        }
    },
    releaseAnnouncementCallback: function (result) {
        var d = this.$scope.data;
        if (result.status) {
            tool.alert('发布公告成功！');
            d.isReadonly = true;
            d.isReleaseShow = false;
            d.isCancelShow = true;
            d.isEnsureShow = false;
            d.isEidterButtonShow = true;
        } else {
            tool.alert(result.msg);
        }
    },
    editAnnouncementCallback: function (result) {
        var d = this.$scope.data;
        if (result.status) {
            tool.alert('发布公告成功！');
            d.isReadonly = true;
            d.isReleaseShow = false;
            d.isCancelShow = true;
            d.isEnsureShow = false;
            d.isEidterButtonShow = true;
        } else {
            tool.alert(result.msg);
        }
    }
}