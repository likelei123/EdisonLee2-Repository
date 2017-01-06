var tool = require('../../../public/component/toollib.js');
module.exports = PasswordService;

function PasswordService(scope) {
    this.scope = scope;
    this.resetPasswordByPhone = "/user/user/resetPasswordByPhone"; //忘记密码
    this.rePassword = "/user/user/rePassword"; //修改密码
};
PasswordService.prototype = {
    SetPasswordByPhone: function (res) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            url: this.resetPasswordByPhone,
            type: 'POST',
            dataType: 'json',
            data: res
        });
        service.then(function (result) {
            self.scope.PasswordByPhoneCallback(result);
        }, function (error) {
            console.error('网络服务出错');
        });
    },
    SetRePassword:function (res) {
         var service = new tool.Service();
        var self = this;
        service.ajax({
            url: this.rePassword,
            type: 'POST',
            dataType: 'json',
            data: res
        });
        service.then(function (result) {
            self.scope.RePasswordCallback(result);
        }, function (error) {
            console.error('网络服务出错');
        });
    }
}