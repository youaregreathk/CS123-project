/**
 * Created by Venugopal on 5/6/2016.
 */

var express = require('express');


var panelRoutes = function (Panel) {
    var panelRouter = express.Router();
    var panelController = require('../Controllers/panelController')(Panel);
    panelRouter.route('/')
        .get(panelController.get)

        .post(panelController.post);

    panelRouter .use('/:panelId', function(req,res,next){
        //Module.findOne({"panelId":req.params.panelId}, function(err, panel) {
          Panel.findOne({"panelId":req.params.panelId}, function(err, panel) {  
            if (err) {
                console.log("error");
            }

            else if(panel){
                req.panel = panel;
                next();
            }
            else {
                res.status(404).send("not found");
            }
        });
    })
    panelRouter .route('/:panelId')
        .get(function(req,res){
            res.json(req.panel);
        })

        .put(function(req,res){

            req.panel.deviceId= req.body.deviceId;
            req.panel.deviceType = req.params.deviceType;
            req.panel.nfail = req.params.nfail;
            req.panel.npass = req.params.npass;
            req.panel.startTime = req.params.startTime;
            req.panel.endTime = req.params.endTime;
            req.panel.resets = req.params.resets;
            req.panel.uiVersion = req.params.uiVersion;
            req.panel.swVersion = req.params.swVersion;
            req.panel.panelId = req.params.panelId;


            req.panel.save();
            res.json(req.panel);
        })

        .patch(function(req,res){
            if(req.body._id){
                delete req.body._id;
            }
            for(var p in req.body){
                req.panel[p] = req.body[p];

            }

            req.module.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(req.panel);

            });
        })

        .delete(function(req,res){

            req.panel.remove(function(err){
                if(err)
                    res.status(404).send(err);
                else
                    res.status(204).send('Removed');
            });
        });

    return panelRouter;
};

module.exports = panelRoutes;