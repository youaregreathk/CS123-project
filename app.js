
var express = require('express'),
	mongoose= require('mongoose'),
	bodyParser = require('body-parser');
var path = require('path');


var db = mongoose.connect('mongodb://localhost/tests');

var Test = require('./models/testModel');
var Mod = require('./models/moduleModel');
var Result = require('./models/resultModel');
var Panel = require('./models/panelModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var testRouter = require('./Routes/testRoutes')(Test,Result,Mod,Panel);
var modRouter = require('./Routes/moduleRoutes')(Mod,Test);
var panelRouter = require('./Routes/panelRoutes')(Panel);

app.use(express.static(path.join(__dirname, 'angularjs')));    //Newly added

app.use('/api/tests',testRouter);
app.use('/api/modules',modRouter);
app.use('/api/testPanels',panelRouter);

app.get('/',function(req, res){
	res.send('gulp interface running on port, welcome to my api!');
});

app.listen(port, function (){
	//console.log("gulp interface running on port" + port);
});

