
/**
 * Module dependencies.
 */

var express = require('express');
var consolidate = require('consolidate');
var routes = require('./routes');
var search = require('./routes/search');

var QuotationModel = require('./services/dbconfigure').QuotationModel;

var model = new QuotationModel();

var http = require('http');
var path = require('path');

var app = express();

var quotations;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('jade', consolidate.jade);
app.engine('ejs', consolidate.ejs);
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/search', search.query);

model.find({},function (error, docs){
    if(error){
		console.log(error);
    }
	
    quotations = docs;
	    exports.quotations = quotations;
	    console.log('quotations retrieved: ' + quotations.length);
	    http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
});

