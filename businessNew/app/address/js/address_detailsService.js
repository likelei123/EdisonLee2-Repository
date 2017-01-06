var tool=require("../../../public/component/toollib");
module.exports=AddressDetails;
function AddressDetails(scope){
    this.scope=scope;
    this.AddDeliveryAddress="/Shop/Index/addShopAddr"
};
AddressDetails.prototype={
    AddAddress:function(res){
        var self=this;
        var service=new tool.Service();
        service.ajax({
            type:"GET",
            url:this.AddDeliveryAddress,
            dataType:"json",
            data:res
        });
        service.then(function(result){
            self.scope.AddAddressData(result)
        },function(error){
            tool.alert("后台数据错误")
        })
    }
}