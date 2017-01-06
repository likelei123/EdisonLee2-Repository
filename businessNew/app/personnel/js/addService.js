var tool = require("../../../public/component/toollib");
module.exports = AddList;

function AddList(scope) {
    this.scope = scope;
    this.AddUrl = "/Shop/Index/addNewEmployeeRights";
    this.CodeUrl="/Shop/Index/sendMsg";

};
AddList.prototype = {
    SetAddInfo: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.AddUrl,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.SetAddData(result)
        }, function (error) {
            tool.alert("后台报错")
        })
    },
SetCodeInfo:function (res) {
      var service_v2 = new tool.Service();
        var self = this;
        service_v2.ajax({
            type: "POST",
            url: this.CodeUrl,
            dataType: "json",
            data: res
        });
        service_v2.then(function (params) {
            self.scope.GetCodeData(params)
         
        },function () {
            tool.alert("后台报错")
        })
}
}