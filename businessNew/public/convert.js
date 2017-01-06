var http = require('http');
var fs = require('fs');


var url = 'http://192.168.31.92/service_v2.0/index.php/Home/Province/AllProvinceCityCounties';


http.get(url,(res)=>{
    var text = ""
    res.on("data",(data)=>{
        text+=data
    });

    res.on("end",()=>{
        

        var data = JSON.parse(text).data;
        var result = {
        	provinces: [],
        	citys: [],
        	regions: []
        };

        for(var i = 0 ; i < data.length ; i++) {
        	result.provinces.push({
        		"ProID": data[i].provinceId,
	    		"name": data[i].provinceName,
        	});
        	var arr = data[i].cities;
        	for(var j = 0 ; j < arr.length ; j++) {
        		result.citys.push({
        			"CityID": arr[j].cityId,
				    "name": arr[j].cityName,
				    "ProID": arr[j].provinceId,
        		});

        		var list = arr[j].counties;
        		for(var k = 0 ; k < list.length ; k++) {
        			result.regions.push({
        				"DisName": list[k].countyName,
    					"CityID": list[k].cityId,
    					"countyId": list[k].countyId
        			});
        		}
        	}
        }

        var resultText = JSON.stringify(result);
        // console.log(resultText);

        //写入文件
		fs.writeFile('component/region.js', 'module.exports = '+resultText, function (err) {
			if (err) throw err;
			console.log('It\'s saved!');
		});
    });
}).on("error",(e)=>{
    console.log(`获取数据失败: ${e.message}`)
})