var tool = require("../../../public/component/toollib");
module.exports = ScanCodeService;

function ScanCodeService(scope) {
    this.scope = scope;
    this.CheckConsumeCode = "/Iorder/Iorder/CheckConsumeCode";
};
ScanCodeService.prototype = {
    checkConsumeCode: function (ops) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.CheckConsumeCode,
            dataType: "json",
            data: ops
        });
        service.then(function (result) {
            self.scope.checkConsumeCodeCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    }
}