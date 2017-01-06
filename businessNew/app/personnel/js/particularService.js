var tool = require("../../../public/component/toollib");
module.exports = ParticularsList;

function ParticularsList(scope) {
    this.scope = scope;
    this.staffWallEditUrl = "/Shop/Index/staffDetail"; //员工详情
    this.RightsUrl = "/Shop/Index/checkEmployeeRights"; //获取员工权限
    this.StatusUrl = "/Shop/Index/editStaffWorkStatus" //员工状态修改
    this.WallEditUrl = "/Shop/Index/editNewEmployeeRights" //员工编辑
}
ParticularsList.prototype = {
    SetStaffInfo: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.staffWallEditUrl,
            dataType: "json",
            data: res
        });
        service.then(function (params) {
            self.scope.BackStaffDate(params)
        }, function () {
            tool.alert("后台报错")
        })
    },
    SetRightsInfo: function (res) {
        var service_two = new tool.Service();
        var self = this;
        service_two.ajax({
            type: "POST",
            url: this.RightsUrl,
            dataType: "json",
            data: res
        });
        service_two.then(function (rulse) {
            self.scope.BackRightsData(rulse)
        }, function () {
            tool.alert("后台出错")
        })

    },
    SetStatusInfo: function (res) {
        var service_three = new tool.Service();
        var self = this;
        service_three.ajax({
            type: "POST",
            url: this.StatusUrl,
            dataType: "json",
            data: res
        });
        service_three.then(function (rulse) {
            self.scope.GetStatusData(rulse)
        }, function () {
            tool.alert("后台出错")
        })
    },
    SetWallEditUrlInfo: function (res) {
        var service_four = new tool.Service();
        var self = this;
        service_four.ajax({
            type: "POST",
            url: this.WallEditUrl,
            dataType: "json",
            data: res
        });
        service_four.then(function (rulse) {
            self.scope.GetEditUrlData(rulse)
        }, function () {
            tool.alert("后台出错")
        })
    }
}