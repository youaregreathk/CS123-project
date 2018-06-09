/**
 * Created by Venugopal on 5/6/2016.
 */

var panelController = function(Panel){

    var post = function(req,res){
        var panel= new Panel(req.body);
        if(!req.body.panelId){
            res.status(400);
            res.send('panel id is required');
        }
        else {
            panel.save();
            console.log(test);
            res.status(201);
            res.send(panel);
        }
    }
    /*
    var get = function(req,res){
        var query = {};
        if(req.query.panel)
        {
            query.panel= req.query.panel;
        }
        Panel.find(query, function(err, panels){
            if(err)
                console.log("error");
            else
                res.json(panels);
        });
    }
    */

    var get = function(req,res){
        var query = {};
    
        Panel.find(query, function(err, panels){
            if(err)
                console.log("error");
            else
                res.json(panels);
        });
    }
    return{
        post: post,
        get: get
    }
}

module.exports = panelController;
