/**
 * Created by Venugopal on 5/6/2016.
 */

var express = require('express');


var modRoutes = function (Module,Test) {
    var modRouter = express.Router();
    //var modController = require('../Controllers/modController')(Module);
    var modController = require('../Controllers/modController') (Module,Test);

    modRouter.route('/')
        .get(modController.get)

        .post(modController.post);

    modRouter.use('/:modId', function(req,res,next){
        Module.findOne({"modId":req.params.modId}, function(err, mod) {
            if (err) {
                console.log("error");
            }

            else if(mod){
                req.module = mod;
                next();
            }
            else {
                res.status(404).send("not found");
            }
        });
    })
    modRouter.route('/:modId')
        
        .get(function(req,res){
            res.json(req.module);
        })
         
      

        .put(function(req,res){

            req.module.title = req.body.title;
            req.module.modId= req.params.modId;

            req.module.save();
            res.json(req.Module);
        })

        .patch(function(req,res){
            if(req.body._id){
                delete req.body._id;
            }
            for(var p in req.body){
                req.module[p] = req.body[p];

            }

            req.module.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(req.module);

            });
        })

        .delete(function(req,res){

            req.module.remove(function(err){
                if(err)
                    res.status(404).send(err);
                else
                    res.status(204).send('Removed');
            });
        });

    return modRouter;
};

module.exports = modRoutes;