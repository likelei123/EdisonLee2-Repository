var tool = require("../../../public/component/toollib");
module.exports = PowerList;

function PowerList(scope) {
    this.scope = scope;
    this.PermisUrl = "/Shop/Index/checkStoreAuthority";
};
PowerList.prototype = {
    SetPermis: function (res) {
        console.log(res);
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.PermisUrl,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.GetPermisData(result)
        }, function () {
            tool.alert("后台报错")
        })
    }
}