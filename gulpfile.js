
var gulp = require('gulp'),
    nodemon =  require('gulp-nodemon'),
	gulpmMocha = require('gulp-mocha'),
	nodeInspector = require('gulp-node-inspector');

    gulp.task('default',function(){
    	nodemon({
    		script: 'app.js',
			exec: 'node',
    		ext: 'js',
    		env: {
    			PORT:8000
    		},
			debug:true,
    		ignore: ['./node_modules/**']
    	})
    	.on('restart', function(){
    		console.log('Restarting');
    	});
    });

gulp.task('test', function(){

	gulp.src('Tests/*.js', {read:false})
		.pipe(gulpmMocha({reporter:'nyan'}));
})

gulp.task('debug', function() {

	gulp.src([])
		.pipe(nodeInspector({
			debugPort: 8080,
			webHost: '0.0.0.0',
			webPort: 8000,
			saveLiveEdit: false,
			preload: true,
			inject: true,
			hidden: [],
			stackTraceLimit: 50,
			sslKey: '',
			sslCert: ''
		}));
});