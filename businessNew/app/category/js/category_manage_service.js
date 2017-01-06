var tool = require("../../../public/component/toollib");
module.exports = CategoryManageService;

function CategoryManageService(scope) {
    this.scope = scope;
    this.addCustomCategory = "/Shop/Index/addCustomCategory";
    this.customCategoryList = "/Shop/Index/customCategoryList";
    this.delCustomCategory = "/Shop/Index/delCustomCategory";
};
CategoryManageService.prototype = {
    addCustomCategoryRun: function (options) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "POST",
            url: this.addCustomCategory,
            dataType: "json",
            data: options
        });
        service.then(function (result) {
            self.scope.addCustomCategoryCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    customCategoryListRun: function (ops) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "GET",
            url: this.customCategoryList,
            dataType: "json",
            data: ops
        });
        service.then(function (result) {
            self.scope.customCategoryListCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    },
    delCategoryListRun: function (categoryId,shopId,token) {
        var service = new tool.Service();
        var self = this;
        service.ajax({
            type: "GET",
            url: this.delCategoryList,
            dataType: "json",
            data: {
               categoryId:categoryId, 
               shopId:shopId,
               token:token
            }
        });
        service.then(function (result) {
            self.scope.delCategoryListCallback(result);
        }, function (error) {
            alert("后台数据错误!")
        })
    }
}