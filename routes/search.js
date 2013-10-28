
/*
 * GET users listing.
 */

exports.search = function(req, res){

  
    var query = req.param('q');

    if(query){
	console.log(query);
    }else{
	console.log('Nada');
    }

  res.render('search', { title: 'Search' });
};
