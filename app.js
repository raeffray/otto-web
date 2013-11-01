
/**
 * Module dependencies.
 */

var express = require('express');
<<<<<<< HEAD
var routes = require('./routes/index');
var data = require('./routes/data');
=======
var consolidate = require('consolidate');
var routes = require('./routes');
var search = require('./routes/search');

var QuotationModel = require('./services/dbconfigure').QuotationModel;

var model = new QuotationModel();
>>>>>>> d06e98bd362175accff1e93f9c6277418f15dcd3

var http = require('http');
var path = require('path');

var db = require('./model/db');
var Quotation = require("./model/schemas").Quotation;


var app = express();


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

app.get('/data', data.map);


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
