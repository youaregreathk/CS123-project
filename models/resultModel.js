/**
 * Created by Venugopal on 5/17/2016.
 */



var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var result =  Schema ({
    status:{
        type: String,
        default:"fail"
    },
    failureReason:String,
    timeStamp:Date,
    duration:String,
    exception:String,
    reboot: Boolean,
    logFile:String,
    panelId:String,                  //Newly added panelId
    //testMachine:String               //Newly addedd testMachine
    flavorId:String,                 //Newly added
    uiVersion:String,                //Newly addad
    deviceId:String,
    deviceType:String,

});

module.exports = mongoose.model('Result',result);