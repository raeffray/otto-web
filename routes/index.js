
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log('aaaaaa');  
  res.render('index', { title: 'Express' });
};