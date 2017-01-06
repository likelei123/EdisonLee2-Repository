var tool = require("../../../public/component/toollib");
module.exports = registerService;

function registerService(scope) {
    this.scope = scope;
    this.RegisterPhoneNum = "/user/Register/RegisterPhoneNum";
    this.loginByPhoneNum = '/user/login/loginByPhoneNum';
};
registerService.prototype = {
    RegisterPhone: function (res) {
        var register = new tool.Service();
        var self = this;
        register.ajax({
            type: "POST",
            url: this.RegisterPhoneNum,
            dataType: "json",
            data: res
        });
        register.then(function (result) {
            self.scope.registerPhoneCallback(result)
        }, function (error) {
            tool.alert("后台出错");
        })
    },
    login: function(phone, pwd) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            url: this.loginByPhoneNum,
            type: 'POST',   
            dataType: 'json',
            data: {
                phoneNum: phone,
                pwd: pwd
            }
        });
        service.then(function(result) {
            self.scope.loginCallback(result);
        }, function(error) {
            tool.alert('网络服务出错');
        });
    }
}