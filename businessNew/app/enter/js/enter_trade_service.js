var tool = require("../../../public/component/toollib");
module.exports = EnterListService;

function EnterListService(scope) {
    this.scope = scope;
    this.catList = "/Shop/Index/catList";
};
EnterListService.prototype = {
    fetchCatList: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "GET",
            url: this.catList,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.fetchCatListCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    }
}