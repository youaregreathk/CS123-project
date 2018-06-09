


var testIdController = function(Test,Module,Result){

    var get = function(req,res){
        //console.log("Here");

        Test.findOne({testId: req.params.testId},function(err, atest){
            
            if(err)
                console.log("error");

            else if (atest!==null){
                console.log(atest);
                res.json(atest);
               }

            else {
               console.log("No such test")
               res.sendfile('/Users/michaelshea/Verizon/stb-testdata/Public/nofound.html');   //__dirname+'/index.html'
              }
        });

    }

    var post = function(req,res){
        console.log("There");

        if(inputChecker(req,res)){
            res.send('Error: Bad Input Data');
            console.log("Error: Bad Input Data");
            return;
        }


        req.test.testId=req.params.testId;
        req.test.title = req.body.title;
        req.test.moduleName = req.body.moduleName;
        req.test.description = req.body.description;

        var result = new Result();
        result.status = req.body.results[0].status;
        
        console.log(req.body.results[0].timeStamp);
        result.timeStamp = req.body.results[0].timeStamp;
        console.log(result.timeStamp);

        result.failureReason = req.body.results[0].failurereason;
        result.duration = req.body.results[0].duration;
        result.exception = req.body.results[0].exception;
        result.reboot = req.body.results[0].reboot;
        result.logFile = req.body.results[0].logFile;
        result.panelId = req.body.results[0].panelId;                                        //   Add panel id
        result.deviceType = req.body.results[0].deviceType;
        result.deviceId = req.body.results[0].deviceId;
        result.uiVersion = req.body.results[0].uiVersion;              //Newly added
        result.flavorId = req.body.results[0].flavorId;                //Newly added
        

        //save result entry in the collection.
        result.save(function (err) {
            if(err)
                console.log("error");
            //else
                //console.log("No Error");
        });
        //console.log(req.test.results);

        // now push the result to test entry.
        req.test.results.push(result);

        // update the module with the test.
        
      

        /*
        Module.update({ "modId":req.current_module.modId ,tests: {"$elemMatch": {testId: req.params.testId}}},{  
         $set:  
          {  
           "testId" : "100"
          }
        },
        function (err, mod) {
            if (err) 
                console.log("Error");
            else
                console.log("No update Error");
  
        });
      */










      /*
       Module.findOne({"modId":req.current_module.modId,tests: {"$elemMatch": {testId: req.params.testId}}}, function(err,mod){
            if(mod){
                console.log("VZZZ");
                 $push:  
                    {  
                        //"tests.$.results":  
                        //{   
                          "duration" : "3s"
                        //}
                    }
                    mod.save();
                 
                } 
             else{
                console.log("gracios");
                req.current_module.tests.push(req.test);
                req.current_module.save();
            }
          })
        */           
             /*
             mod.find({"testId":req.params.testId}, function(err,test){
                if(test){
                console.log("Hola");  
                //req.current_module.tests.push(req.test)
                //console.log(req.test);
                test.results.push(req.test);
                 //console.log(mod.test);
                
                //mod.test.pushreq.current_module.tests;
                test.save();
               }


             })
             
            }
            */
            
            
        //Push the test Object id into the modules.test array
        //req.current_module.tests.push(req.test);
        //console.log(req.test._id);
        req.current_module.testsAdr.addToSet(req.test._id);
        req.current_module.save();
        

     
        
        req.test.save(function (err) {
            if (err)
                res.status(500).send(err);
            else
                res.json(req.test);

        });

        

        req.current_panel.tests.addToSet(req.test._id);
        req.current_panel.save();

        req.current_panel.save(function (err) {
            if (err)
                res.status(500).send(err);
                //console.log("No Error saving panel function")
            
            //else
                //res.json(req.current_panel);
                //console.log("There is no an Error")

        });



    }
    return{
        post: post,
        get: get
    }
}


function inputChecker(req){
    //console.log("Inside here");
    //Check title
    if (typeof req.body.title === 'undefined')
        return true;
    //Check moduleName
    else if(typeof req.body.moduleName === 'undefined')
        return true;
    //Check testMachine
    /*
    else if(typeof req.body.results[0].deviceType === 'undefined')             
        return true;
    else if(typeof req.body.results[0].deviceId === 'undefined')
        return true;
    */
    //Check if it contain TestsResults
    else if(typeof req.body.results === 'undefined')
        return true;


    return false
}


module.exports = testIdController;
