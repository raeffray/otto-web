var Client = require('node-rest-client').Client;

var url = "http://maps.google.com/maps/api/geocode/json"

var client = new Client();

SearchAddress = function(){
    // registering remote methods
    client.registerMethod("jsonMethod", url, "GET");
    
}

SearchAddress.prototype.search = function(address,callback){

    var args ={
	   parameters:{address: address ,sensor:'false'}
    };

    console.log('searching: ' + address);	

    sleep(2000);
    
    client.methods.jsonMethod(args, function(data,response){

        var obj = JSON.parse(data);

        console.log(address + ': ' + obj.status);

        callback(obj);

    });

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 2e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

exports.SearchAddress = SearchAddress;




