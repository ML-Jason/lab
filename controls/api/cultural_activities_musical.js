//var http = require('http');
var request = require('request');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var lastUpdateDate = -1;
var timer = 0;

module.exports = function(app) {
	getData();
	app.all(process.env.VPATH + '/api/cultural_activities/musical', musical);
}

function getData() {
	clearTimeout(timer);
	timer = setTimeout(getData, 1000*60);
	var _date = (new Date()).getDate();
	if (_date == lastUpdateDate)
		return;
	lastUpdateDate = _date;
	var _dist = path.resolve('./public/api_data');
	fs.stat(_dist, function(err, stats) {
		if (err) {
			if (err.code == 'ENOENT') {
				mkdirp(_dist);
			} else
				return console.log(err);
		}
		_dist = path.resolve('./public/api_data/musical.json');
		request
			.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=1')
			.on('response', onResponse)
			.pipe(fs.createWriteStream(_dist));
	});
}

function musical(req, res) {
	var _dist = path.resolve('./public/api_data/musical.json');
	fs.readFile(_dist, 'utf8', function (err,data) {
		if (err) {
			console.log(err);
			res.status(500);
		}
		res.send(data);
	});
}

function onResponse(response) {
	console.log('/api/cultural_activities/musical Updated!');
}