var tool = require("../../../public/component/toollib");
module.exports = PersonnelList;

function PersonnelList(scope) {
    this.scope = scope;
    this.Getlisturl = "/Shop/Index/staffWall";
    this.EmpCountUrl="/Shop/Index/empCount"
};
PersonnelList.prototype = {
    //获取员工列表
    Setinfo: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.Getlisturl,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.GetPersonDate(result);
        }, function (error) {
            alert("后台数据错误")
        })
    },
    //获取各种状态的员工的数量
    SetEmpCountData:function (res) {
         var service_two= new tool.Service();
        var self = this;
        service_two.ajax({
            type: "POST",
            url: this.EmpCountUrl,
            dataType: "json",
            data: res
        });
        service_two.then(function (result) {
            self.scope.GetEmpCountDate(result);
        }, function (error) {
            alert("后台数据错误")
        })
    }

}