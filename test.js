
var QuotationModel = require('./services/dbconfigure').QuotationModel;

var model = new QuotationModel();
//'{\'station.normalizedAddress\' : \'aaaaRua Bruno Seabra, 21, Sao Paulo, Sao Paulo\'}'
model.findOne({'station.normalizedAddress' : 'Rua Bruno Seabra, 21, Sao Paulo, Sao Paulo'},function (error, docs){
    if(error){
	console.log(error);
    }
    console.log(docs.city)
});
