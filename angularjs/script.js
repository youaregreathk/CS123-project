	// create the module
	var scotchApp = angular.module('scotchApp', ['ngRoute',"chart.js"]);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/panel.html',
				controller  : 'panelController'
			})

			.when('/modules', {
				templateUrl : 'pages/module.html',
				controller  : 'mainController'
			})

			.when('/chart', {
				templateUrl : 'pages/chart.html',
				controller  : 'chartController'
			})
			
			.when('/test/:testId', {
				templateUrl : 'pages/test.html',
				controller  : 'testController'
			})

			
			.when('/panel/:panelId', {
				templateUrl : 'pages/panelDetail.html',
				controller  : 'panelDetailControler'
			});

	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope, $http) {
		$http.get('http://localhost:8000/api/modules/').success(function(data) {
			$scope.result = data;
		}); 
    });

	

	scotchApp.controller('panelController', function($scope, $http) {
	    
	    $scope.orderByField = 'status';
    	$scope.reverseSort = false;	

		$http.get('http://localhost:8000/api/testPanels/').success(function(data) {
			$scope.result = data;
		}); 
		
		
	});


	scotchApp.controller('testController', function($scope,$location, $http) {
		
		var url = $location.url();		
		var npass,nfail;
		
		$scope.testId=url.substring(6,url.length);
		
		
		$http.get("http://localhost:8000/api/tests/"+$scope.testId).success(function(data) {
			$scope.result = data;
			var npass=parseInt(data.npass);
			var nfail=parseInt(data.nfail);
			var nerror=parseInt(data.nerror);
				
			$scope.labels = ["pass", "fail","Error"];
  		    $scope.data = [npass,nfail,nerror];
		}); 
	});

	

	scotchApp.controller('RowCtrl', function ($scope, $location) {

    	$scope.toggleRow = function (input) {
      		//$location.url('/panel/'+input);
    };

    	$scope.isSelected = function (i) {
      return $scope.selected;
    	};
	});


    scotchApp.controller('panelDetailControler', function($scope,$location, $http) {
    	
    	$scope.orderByField = 'status';
    	$scope.reverseSort = false;		
		var url = $location.url();						
		$scope.testId=url.substring(7,url.length);
		$scope.panelReuslt;

		$http.get("http://localhost:8000/api/testPanels/"+$scope.testId).success(function(data) {
			$scope.panelResult = data;
			
		}); 


		
		$http.get("http://localhost:8000/api/tests/").success(function(data) {
			$scope.result = data;
			
			$scope.finalobj=[];

    
    		for(var i=0; i<data.length;i++ ){
    			for(var j=0;j<data[i].results.length;j++){
    				if(data[i].results[j].panelId == $scope.testId){
    					 var resultObj=data[i].results[j];
    					 resultObj.title=data[i].title;
    					 resultObj.moduleName=data[i].moduleName;
    					 $scope.finalobj.push(resultObj)
    				}    			
    			}	
    		}
		}); 	
	});



	scotchApp.controller('chartController', function($scope,$location,$http) {

	 $http.get('http://localhost:8000/api/testPanels/').success(function(data) {		 
		$scope.result = data;
			var panelObjArray=[];
			var nlabels=[];
			var npass=[];
			var nfail=[];
			var nduration=[]
             
            function testClass (labels,pass,fail,duration) {
 		   	  this.labels = labels;
 		   	  this.pass=pass;
 		   	  this.fail=fail;
 		   	  this.duration=duration;
			}

			for(var i=0;i<data.length;i++){
				var labels=data[i].panelId;
				var pass=parseInt(data[i].npass,10);
				var fail=parseInt(data[i].nfail,10)+parseInt(data[i].nerror,10);
				var duration= parseInt(data[i].duration,10);
				var tmpTestObj = new testClass(labels,pass,fail,duration);
				panelObjArray.push(tmpTestObj);
			}

			function compare(a,b){
				if(a.labels<b.labels)
					return -1;
				else
					 return 1;
			}
            panelObjArray.sort(compare);


			for(var i=0;i<panelObjArray.length;i++){
				nlabels.push(panelObjArray[i].labels);
				npass.push(panelObjArray[i].pass);
				nfail.push(panelObjArray[i].fail);
				nduration.push(panelObjArray[i].duration);
			}


		Highcharts.chart('container', {
      		chart: {
            		type: 'areaspline'
        	},
        	title: {
            	text: 'STB Test Results'
        	},
        	legend: {
            	layout: 'vertical',
            	align: 'left',
            	verticalAlign: 'top',
            	x: 150,
            	y: 100,
            	floating: true,
            	borderWidth: 1,
            	backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        	},
        	xAxis: {
            	categories:nlabels 
        	},
        	yAxis: {
            	title: {
                	text: 'Test Cases'
            	}
        	},
        	tooltip: {
            	shared: true,
            	valueSuffix: ' units'
        	},
        	credits: {
            	enabled: false
        	},
        	plotOptions: {
            	series:{
            		 allowPointSelect: true,
            		 point: {
                       events: {
                  			click: function() {
                  				console.log("haha");
                      			window.location.href="http://localhost:8000/#/panel/"+this.category;
                          	}
                       }
                     }
                 },
            	
            	
            	areaspline: {
                	fillOpacity: 0.5
            }
        	},
        	series: [{
            	name: 'Pass',
            	data:npass,
            	}, {
            	name: 'Fail+Error',
            	data:nfail
        	}]
    	  });
		Highcharts.chart('container1', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Tests Duration'
        },
        /*
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        */
        xAxis: {
            categories: nlabels 
        },
        yAxis: {
            title: {
                text: 'Time (min)'
            }
        },
        plotOptions: {

            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Tests',
            data: nduration
        }]
    });
	});
			 	
	});