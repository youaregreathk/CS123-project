/**
 * Created by Venugopal on 5/17/2016.
 */



var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testmodel = require('./testModel').schema;


var panelModel =  Schema ({
    deviceId:String,
    deviceType:String,
    nfail:String,
    npass:String,
    nerror:String,         //Newly added
    totalTest:String,      //Newly added
    startTime:String,
    endTime:String,
    duration:String,         //Newly added
    resets:String,
    flavorId:String,                 //Newly added
    uiVersion:String,                //Newly addad
    swVersion:String,
    panelId: String,
    tests:[Schema.Types.ObjectId]
});

module.exports = mongoose.model('Panel',panelModel);