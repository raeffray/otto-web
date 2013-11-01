
var db = require('../model/db');
var Quotation = require("../model/schemas").Quotation;
/*
 * GET users listing.
 */

exports.map = function(req, res){


//swLat=-23.57553197576093&swLng=-46.67292594909668	&neLat=-23.56530490508696&neLng=-46.656789779663086
	

	var swLat = req.param('swLat');
	var swLng = req.param('swLng');
	var neLat = req.param('neLat');
	var neLng = req.param('neLng');

	var opt = {
		'lat' : {$gt: neLat},
		'lat' : {$lt: swLat},
		'lng' : {$gt: neLng},
		'lng' : {$lt: swLng}
	}

	Quotation.find(opt,function (error, docs){

	    if(error){
			console.log(error);
	    }
		
	    console.log('items found: ' + docs.length);

 		res.send(docs);  
    
	});
    
  
};
