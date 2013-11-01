

var db = require('../model/db');

var AnpCrawled = require("../model/schemas").AnpCrawled;
var Quotation = require("../model/schemas").Quotation;
var SearchAddress =  require('../services/google-get-coordinates').SearchAddress;

var searchAddress = new SearchAddress();

retrieve({},normalize);

/**
 * Queries AnpCrawled items 
 * @param {argument} query argument.
 * @param {function} callback to return results.
 */
function retrieve(argument,callback){
    
    AnpCrawled.find(argument).sort({station: 1}).exec(function(err,data){
 	if(err){
	    console.log(err);
	    return err;
  	}
 	callback(data);
    });
}

/**
 * Iterate over documents and retrieves documents with the same address (or same station) to
 * to find N fuel that a given stations works.
 * @param {docs} documents to be processed.
 */
function normalize(docs){
    
    var lastName;
    
    for (var i = 0; i < docs.length; i++) {
	var doc = docs[i];
	
	if(lastName != doc.station.name){
	    retrieve({'station.normalizedAddress' : doc.station.normalizedAddress},fetchEachStation);	
	    lastName = doc.station.name;
	}
    }
}

/**
 * Works with each fuel for a given station
 * @param {docs} documents to be processed.s
 */
function fetchEachStation(docs){
    
    var quotation = {
	week: docs[0].week,
	city: docs[0].city,
	state: docs[0].station.address.city.state.name,
	lat: docs[0].station.address.lat,
	lng: docs[0].station.address.lng,
	station: {
	    name: docs[0].station.name,
	    normalizedAddress: docs[0].station.normalizedAddress,
	},
	fuel: []
    }
    
    for (var i = 0; i < docs.length; i++) {
	var doc = docs[i];
	
	var fuel = {
	    fuel: doc.fuel,
	    brand: doc.station.brand ,
	    sellingPrice: doc.station.sellingPrice,
	    cost: doc.station.cost,
	    purchaseMode: doc.station.purchaseMode,
	    supplier: doc.station.supplier,
	    date: doc.station.date
	}
	
	quotation.fuel.push(fuel);
    }
    
    searchAddress.search(docs[0].station.normalizedAddress,function(data){

	sleep(2000);
	
	if(typeof data.results[0] == 'undefined'){
		console.log('Address not found: ' + docs[0].station.normalizedAddress);
		return;
	}
	
	quotation.lat = data.results[0].geometry.location.lat;
	quotation.lng = data.results[0].geometry.location.lng;

	console.log(quotation);
	
	Quotation.create(quotation, function(err, doc) {
    	    var strOutput;
	    if (err) {
		console.log(err);
		strOutput = 'Error creating quotation';
	    } else {
		console.log('Quotation created: ' + doc.station.name);
	    }
	});
	
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
