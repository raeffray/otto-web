var http = require ('http');
var mongoose = require ("mongoose");
var port = process.env.PORT || 27017;
var connectionString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/otto';
var Schema = mongoose.Schema;


QuotationModel = function (){
    mongoose.connect(connectionString, function (err, res) {
	if (err) { 
	    console.log ('ERROR connecting to: ' + connectionString + '. ' + err);
	} else {
	    console.log ('Succeeded connected to: ' + connectionString);
	}
    });
}

var quotationSchema = new Schema(
{
   week: String,
   city: String,
   fuel: Number,
   station:{
      address:{
         city: {
            code: String,
            name: String,
            state:{
              code: String,
              name: String
            }
         },
         street: String,
         neighborhood: String
      },
      name: String,
      normalizedAddress: String,
      brand: String,
      sellingPrice: String,
      cost: String,
      purchaseMode: String,
      supplier: String,
      date: String
   }
});

var sc = new Schema({});

var Quotation = mongoose.model('Quotation', quotationSchema,'quotation');

QuotationModel.prototype.findOne = function(criteria,callback){

  console.log(criteria);

  Quotation.findOne(criteria, function(err, doc) {
    if (err) return err;
    mongoose.disconnect();
    callback(err,doc);
  });

}

exports.QuotationModel = QuotationModel;
