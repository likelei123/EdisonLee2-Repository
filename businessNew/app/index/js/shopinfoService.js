var tool = require("../../../public/component/toollib");
module.exports = StoreInfoList;

function StoreInfoList(scope) {
    this.scope = scope;
    this.StoreInfoUrl = "/Shop/Index/storeInfo";
    this.storeInfoEditUrl = "/Shop/Index/storeInfoEdit";
};
//获取基本信息的详情
StoreInfoList.prototype = {
    SetStoreInfo: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.StoreInfoUrl,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.BackStoreInfoData(result)
        }, function (error) {
            tool.alert("后台报错")
        })
    },
    //修改基本信息
    SetEditInfo: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.storeInfoEditUrl,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.BackstoreInfoEditData(result)
        }, function (error) {
            tool.alert("后台报错")
        })
    }
}