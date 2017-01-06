

var tool = require("../../../public/component/toollib");
module.exports = EnterAptitudeService;

function EnterAptitudeService(scope) {
    this.scope = scope;
    this.qualificationExamination = "/Merchant/Index/qualificationExamination";
};
EnterAptitudeService.prototype = {
    saveShopDetaile: function (options) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.qualificationExamination,
            dataType: "json",
            data: options
        });
        service.then(function (result) {
            self.scope.saveShopDetaileInfoCallback(result);
        }, function (error) {
        	alert(JSON.stringify(error));
            alert("后台数据错误!")
        })
    }
}