var tool = require("../../../public/component/toollib");
module.exports = StaffList;

function StaffList(scope) {
    this.scope = scope;
    this.staffWallEditUrl = "/Shop/Index/staffWall";
    this.SetstaffIsShowUrl="/Shop/Index/staffIsShow";
};
StaffList.prototype={
    SetStaffInfo:function (res) {
        var service=new tool.Service();
        var self=this;
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
    SetstaffIsShowinfo:function (res) {
        var service_two=new tool.Service();
        var self=this;
         service_two.ajax({
            type: "POST",
            url: this.SetstaffIsShowUrl,
            dataType: "json",
            data: res
        });
       service_two.then(function (backdata) {
           self.scope.BackStaffIsShow(backdata)
       },function () {
           tool.alert("后台报错")
       }) 
    }
}