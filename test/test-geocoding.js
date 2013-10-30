
var SearchAddress =  require('../services/google-get-coordinates').SearchAddress;

var searchAddress = new SearchAddress();


searchAddress.search('Dr Seng Sao Paulo',function(data){
    
    for (i = 0; i < data.results.length; i++) {
    	var result = data.results[i];
		console.log(result.geometry.location.lat);
		console.log(result.geometry.location.lng);

    }    
    
});


