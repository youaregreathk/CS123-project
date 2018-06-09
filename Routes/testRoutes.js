

var express = require('express');



var testRoutes = function (Test, Result, Module,Panel) {
    var testRouter = express.Router();
    var testController = require('../Controllers/testController')(Test,Module);
    var testIdController = require('../Controllers/testIdController')(Test,Module,Result);
    
    testRouter.route('/')
        .get(testController.get)
        .post(testController.post);

    testRouter.route('/:testId')
        .get(testIdController.get);    

    testRouter.use('/:testId', function(req,res,next){
        Test.findOne({"testId":req.params.testId}, function(err, test) {
            if (err) {
                console.log(err);
                res.status(202).send(err);
            }
            else if(test){
                req.test = test;
                if(req.body.results[0].status == "pass")
                    req.test.npass++;
                else if (req.body.results[0].status == "error")
                    req.test.nerror++;
                else
                    req.test.nfail++;
                next();
            }
            else {
                //res.status(404).send("not found");
                req.test = new Test(); // create new Tests

                if(req.body.results[0].status == "pass"){
                    req.test.npass=1;
                    req.test.nfail=0;
                    req.test.nerror=0;
                }
                else if(req.body.results[0].status == "error"){
                    req.test.npass=0;
                    req.test.nfail=0;
                    req.test.nerror=1;
                }
                else{
                    req.test.nfail=1;
                    req.test.npass=0;
                     req.test.nerror=0;
                }

                next();
            }
        });

    })

    //Check Module Collection
    testRouter.use('/:testId', function(req,res,next){
        Module.findOne({"modId":getModId(req.body.moduleName)}, function(err,mod){
            if(err){
                console.log("error retrieving module entry");
                res.status(202).send(err);
            }
            //If there is already a entry in module collection
            else if(mod){
                //testRouter.current_module = mod;
                console.log("trump");

                req.current_module = mod;
                console.log(req.current_module.title);
                next();
            }
            else {
                // create a module entry
                console.log("FKFKFK");
                req.current_module = new Module();
                req.current_module.title = req.body.moduleName
                console.log(req.current_module.title);
                req.current_module.modId =getModId(req.body.moduleName);
                next();
            }
        })
    })

    //Check Panel Collection
    testRouter.use('/:testId', function(req,res,next){
       
        Panel.findOne({"panelId":req.body.results[0].panelId}, function(err,panel){                   //Changed test to body
            console.log(req.body.results[0].panelId);
            if(err){
                console.log("error retrieving Panel");
                res.status(202).send(err);
            }
            else if(panel){
                req.current_panel = panel;
                
                req.current_panel.totalTest++;
                 //Update nfail and n pass
                if(req.body.results[0].status == "pass")
                    req.current_panel.npass++;
                else if(req.body.results[0].status == "error")
                    req.current_panel.nerror++;
                else
                    req.current_panel.nfail++;
                //Update finish time
                
                var tmp=req.body.results[0].timeStamp;
                //tmp = new Date(tmp);

                
                console.log("current start time");
                console.log(req.current_panel.startTime); 
                console.log("current end time");
                console.log(req.current_panel.endTime);
         

                if(  tmp > req.current_panel.endTime)
                    req.current_panel.endTime=tmp;
                
                if(tmp<req.current_panel.startTime)
                    req.current_panel.startTime=tmp;

                
                var tmp1=new Date(req.current_panel.endTime);
                var tmp2=new Date(req.current_panel.startTime);
                /*
                console.log("Time is changing");
                console.log(tmp1-tmp2);
                */

                req.current_panel.duration =(((tmp1-tmp2)/1000)/60).toPrecision(4);
                
                //console.log(req.current_panel.endTime-req.current_panel.startTime);
                next();
            }
            else {
                // create a module entry
                req.current_panel = new Panel();

                req.current_panel.panelId = req.body.results[0].panelId;
                req.current_panel.deviceType=req.body.testMachine;
                req.current_panel.startTime =req.body.results[0].timeStamp
                req.current_panel.duration="0";
                //req.current_panel.startTime ="1990-06-16:21:11:59"
                req.current_panel.endTime =req.body.results[0].timeStamp
                req.current_panel.flavorId = req.body.results[0].flavorId;
                req.current_panel.uiVersion = req.body.results[0].uiVersion;
                req.current_panel.totalTest=1;
                
                
                if(req.body.results[0].status == "pass"){
                    req.current_panel.npass=1;
                    req.current_panel.nfail=0;
                    req.current_panel.nerror=0;
                }
                else if(req.body.results[0].status == "error"){
                    req.current_panel.npass=0;
                    req.current_panel.nfail=0;
                    req.current_panel.nerror=1;
                }
                else{
                    req.current_panel.nfail=1;
                    req.current_panel.npass=0;
                    req.current_panel.nerror=0;
                }
                
                next();
            }
        })
    })
     
    

    testRouter.route('/:testId')
    /*
     .get(function(req,res){
     res.json(req.test);
     })
     */

        //.get(testIdController.get)

        .post(testIdController.post)
        

        .patch(function(req,res){
            if(req.body._id){
                delete req.body._id;
            }
            for(var p in req.body){
                req.test[p] = req.body[p];

            }

            req.test.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(req.test);

            });
        })

        .delete(function(req,res){

            req.test.remove(function(err){
                if(err)
                    res.status(404).send(err);
                else
                    res.status(204).send('Removed');
            });
        });

    return testRouter;
};

function getModId(modName){
    var modId;
    switch (modName){
        case "PPV":
            modId = 1000;
            break;
        case "DVR":
            modId=  1001;
            break;
        case "EAS":
            modId = 1002;
            break;
        case "splash":
            modId = 1003;
            break;
        case "BannerAds":
            modId = 1004;
            break;
        case "callerID":
            modId = 1005;
            break;
        case "myfios":
            modId = 1006;
            break;
        case "menu":
            modId = 1007;
            break;
        case "ppv":
            modId = 1008;
            break;
        case "search":
            modId = 1009;
            break;    
         case "VOD":
            modId = 10010;
            break;    
         case "systeminfo":
            modId = 10011;
            break;
         case "settings":
            modId = 10012;
            break;
         case "welcomescreen":
            modId = 10013;
            break;
        case "widgets":
            modId = 10014;
            break;
        case "cds":
            modId = 10015;
            break;
        case "help":
            modId = 10016;
            break;
        case "messageCenter":
            modId = 10017;
            break;
        case "channelGuide":
            modId = 10018;
            break;
         case "LiveTv":
            modId = 10019;
            break;
         case "forYouTray":
            modId = 10020;
            break;
         case "dvr":
            modId = 10021;
            break;
         case "Conflict":
            modId = 10022;
            break;
         case "reminders":
            modId = 10023;
            break;
        case "fullGuide":
            modId = 10024;
            break;
        case "guide":
            modId = 10025;
            break;
        case "halfScreenGuide":
            modId = 10026;
            break;
        case "miniGuide":
            modId = 10027;
            break;
        case "ChannelSurfer":
            modId = 10028;
            break;
        case "onNow":
            modId = 10029;
            break;
        case "parentalControls":
            modId = 10030;
            break;
        case "screensaver":
            modId = 10031;
            break;
        case "favGuide":
            modId = 10032;
            break;


    }
    return modId;
}
module.exports = testRoutes;