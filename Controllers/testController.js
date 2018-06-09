/**
 * Created by Venugopal on 5/6/2016.
 */

var testController = function(Test,Module){
    var post = function(req,res){
        var test = new Test(req.body);
        if(!req.body.title){
            res.status(400);
            res.send('title is required');
        }
        else {
            test.save();
            res.status(201);

        }
    }

     /*
    var get = function(req,res){

        var tests=[];
        
        Module.find({}, function(err, modules){
            if(err)
                console.log("error");
            else {

                for (var m in modules) {
                    for(var t in modules[m].tests)
                    tests.push(modules[m].tests[t]);
                }

                res.json(tests);
            }
        });
        */
        var get = function(req,res){
        var query = {};
    
        Test.find(query, function(err, tests){
            if(err)
                console.log("error");
            else
                res.json(tests);
        });
    }

    return{
        post: post,
        get: get
    }
}

module.exports = testController;
