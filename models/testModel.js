

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var resultmodel = require('./resultModel').schema;



var testModel =  Schema({
	testId:String,
	title:String,
	description:String,
	moduleName:String,
	lastRunOn: String,
	results:[resultmodel],
	nfail:String,                                  //Newly added
    npass:String,								   //Newly added
    nerror:String
	//testMachine:String                           //Moved to Result
});

module.exports = mongoose.model('Test',testModel);


