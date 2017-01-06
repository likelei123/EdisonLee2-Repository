
var tool = require("../../../public/component/toollib");
module.exports = NoticeIndexService;

function NoticeIndexService(scope) {
    this.scope = scope;
    this.announcementCheck = "/Shop/Index/announcementCheck";
    this.updateShopNoticeStatus = '/Shop/Index/updateShopNoticeStatus';
    this.releaseAnnouncement = "/Shop/Index/releaseAnnouncement";
    this.editAnnouncement = "/Shop/Index/editAnnouncement";
};
NoticeIndexService.prototype = {
    fetchAnnouncementCheck: function (shopId) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.announcementCheck,
            dataType: "json",
            data: {
            	shopId: shopId,
            	noticeType: 1
            }
        });
        service.then(function (result) {
            self.scope.fetchAnnouncementCheckCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    updateShopNoticeStatusRun: function(ops) {
    	var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.updateShopNoticeStatus,
            dataType: "json",
            data: ops
        });
        service.then(function (result) {
            self.scope.updateShopNoticeStatusCallback(result, ops.noticeStatus);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    releaseAnnouncementRun: function(ops) {
    	var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.releaseAnnouncement,
            dataType: "json",
            data: ops
        });
        service.then(function (result) {
            self.scope.releaseAnnouncementCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    editAnnouncementRun: function(ops) {
    	var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.editAnnouncement,
            dataType: "json",
            data: ops
        });
        service.then(function (result) {
            self.scope.editAnnouncementCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    }
}