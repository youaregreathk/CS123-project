/**
 * Created by Venugopal on 5/17/2016.
 */



var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testmodel = require('./testModel').schema;


var moduleModel =  Schema ({
    modId:String,
    title:String,
    testsAdr:[Schema.Types.ObjectId]
});

module.exports = mongoose.model('Module',moduleModel);