process.env.TZ = 'Asia/Kolkata';
(function () {
	'use strict';
	var request = require('request');
	var CronJob = require('cron').CronJob;
	var smtp = require('./mail.js');
	
	//constants
	var LOCATION = 'CHEN'; //HYD, CHEN
	var TIME_ZONE = process.env.TZ;
	var MOVIE_NAME = 'Baahubali';
	var MOVIE_LANG = 'Telugu';
	var API_ENDPOINT = 'http://in.bookmyshow.com/getJSData/?file=/data/js/GetEvents_MT.js&cmd=GETEVENTSWEB&et=MT&rc='+LOCATION;

	//not used
	var getTime = (function () {
		var start = new Date().getTime() / 1000;
		return function() {
			return (new Date().getTime() / 1000) - start;
		};	
	})();
	// console.log(getTime());

	function recieveData(error, response, body) {
	    if (!error && response.statusCode == 200) {
	        // console.log(getTime());
	        // console.time('actual');
	        processData(body);
	    }else{
	    	console.log(error);
	    }
	}

	function processData(body) {
	    var start = body.indexOf('aiEV=') + 5,
	        end = body.indexOf(';aiSRE='),
	        str = body.substring(start, end),
	        moviesArr = JSON.parse(str);
	        searchMovie(moviesArr);
	}
	function searchMovie (movies) {
		var res = [], mov,name, found;
		movies.forEach(function(movie) {
			if (movie[2].toLowerCase()===MOVIE_LANG.toLowerCase()) {
				mov = movie[10].replace(/\s/g, '').toLowerCase();
				name = MOVIE_NAME.replace(/\s/g, '').toLowerCase();
				found = mov.indexOf(name);
				if (found > -1) {
					res.push(movie);
				}
			}
		});
		// console.timeEnd('actual');
		if (res.length>0) {
			console.log('Found movie obj');
			console.log(res);
			console.log('Sending mail...');
			smtp.sendMail(res[0][4]);
		}else{
			console.log(MOVIE_NAME+ ' Not Found, Hibernate till next Cron Job');
		}
	}


	var job = new CronJob('00 10 * * * *', function() {
	//var job = new CronJob(new Date(), function() {	
	  console.log('Cron Triggered at ' + new Date());
	  request(API_ENDPOINT, recieveData);
	  }, function () {
	   console.log('job done');
	  },
	  true, /* Start the job right now */
	  TIME_ZONE 
	);
	console.log(MOVIE_NAME+ ' Hunt Begins at '+ new Date());

	process.stdin.resume();//so the program will not close instantly

	function exitHandler(options, err) {
	    if (options.cleanup) console.log('clean');
	    if (err) console.log(err.stack);
	    if (options.exit) process.exit();
	}

	//do something when app is closing
	process.on('exit', exitHandler.bind(null,{cleanup:true}));

	//catches ctrl+c event
	process.on('SIGINT', exitHandler.bind(null, {exit:true}));

	//catches uncaught exceptions
	process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
})();


