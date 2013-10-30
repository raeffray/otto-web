
var SearchAddress =  require('../services/google-get-coordinates').SearchAddress;

var QuotationModel = require('../services/dbconfigure').QuotationModel;

var model = new QuotationModel();

var searchAddress = new SearchAddress();

/*
 * GET users listing.
 */

exports.query = function(req, res){

    var query = req.param('q');
    
    var quotations = require('../app').quotations
 	
 	res.render('search', { title: 'Search', data: quotations});  
    
  
};
