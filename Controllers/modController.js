/**
 * Created by Venugopal on 5/6/2016.
 */

var modController = function(Mod,Test){


    var post = function(req,res){
        var mod = new Mod(req.body);
        if(!req.body.title){
            res.status(400);
            res.send('title is required');
        }
        else {
            mod.save();
            console.log(test);
            res.status(201);
            res.send(test);
        }
    }
    
    /*
    var get = function(req,res){
        var query = {};
        if(req.query.module)
        {
            query.module = req.query.module;
        }
        Mod.find(query, function(err, tests){
            if(err)
                console.log("error");
            else
                res.json(tests);
        });
    }
    */
    function modClass() {
      this.modId = "123";
      this.title = "hihi";
      this.testname=[];
      this.testId=[];
    } 

    var get = function(req,res){
        var arrayObj = [];
        var modCount = 0;
        
        Mod.count({}, function(err, count){
            modCount=count;
        });

        Mod.find({},function(err, records){
            records.forEach(function(record){
                var modObj = new modClass();
                modObj.modId=record.modId;
                modObj.title=record.title;
         
                for(var i=0;i<record.testsAdr.length;i++){                
                    Test.findById(record.testsAdr[i], function (err, myDocument) {
                        modObj.testname.push(myDocument.title);
                        modObj.testId.push(myDocument._id);  
                        //console.log("modObject length");
                        //console.log(modObj.testname.length);
                        //console.log(record.testsAdr.length);
                        if(modObj.testname.length==record.testsAdr.length){
                            //console.log("In side modObject length");
                            //console.log(modObj.testname.length);
                            //console.log(record.testsAdr.length);
                            arrayObj.push(modObj);
                            //console.log("arrayobject Count");
                            //console.log(arrayObj.length);
                            
                            if(arrayObj.length==modCount){
                                //console.log("USALLLLLLLLLLLLLLLLLLLL");
                                //var result = JSON.stringify(arrayObj);
                                res.json(arrayObj);
                            }
                        }    
                    });
                }
            });
        });
    }    
    
    return{
        post: post,
        get: get
    }
}

module.exports = modController;
