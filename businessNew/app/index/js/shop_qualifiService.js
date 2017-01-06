var tool = require("../../../public/component/toollib");
module.exports = QualifiList;

function QualifiList(scope) {
    this.scope = scope;
    this.EditExaminationUrl = "/Merchant/Index/editExamination"; //修改资质
    this.CheckExaminationUrl = "/Merchant/Index/checkExamination"; //资质详情
};
QualifiList.prototype = {
    //修改资质
    sendEditExaminationInfo: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.EditExaminationUrl,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.BackEditExaminationData(result)
        }, function (error) {
            tool.alert("后台报错")
        })
    },
    //资质详情
    sendCheckExamination: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.CheckExaminationUrl,
            dataType: "json",
            data: res
        });
        service.then(function (result) {
            self.scope.BackExaminationDetalisData(result)
        }, function (error) {
            tool.alert("后台报错")
        })
    }
}