
var QuotationModel = require('../services/dbconfigure').QuotationModel;

var model = new QuotationModel();

/*
 * GET users listing.
 */

exports.query = function(req, res){

    var query = req.param('q');
    
    if(query){
	model.findOne({'station.normalizedAddress' : query},function (error, docs){
	    if(error){
		console.log(error);
		res.render('search', { title: 'Search' });
	    }
	    console.log( {title: 'Search ',data: docs});
	    res.render('search', {title: 'Search ', docs: docs});
	});
	console.log(query);
    }else{
	console.log('Nada');
	res.render('search', { title: 'Search' });
    }
    
    
  
};
