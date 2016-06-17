var formidable = require('formidable');
var pagedata = require('../lib/pagedata.js');

module.exports = function(app) {
	app.all('/', function(req, res) {
		res.send("index");
	});
	app.use(function(req, res, next) {
		console.log(req.path);
		next();
	});

	require('./mng/')(app);
	require('./api/')(app);

	app.all(process.env.VPATH + '/upload', function(req, res) {
		var _rdata = pagedata.getData(req);
		res.render('mng/upload', _rdata);
	});

	app.use(http500);
	app.use(http404);
}
function http500(err, req, res, next) {
	console.log(err.stack);
	res.status(500).send('HTTP 500...');
}
function http404(req, res) {
	console.log(req.path);
	console.log('404');
	res.status(404).send('HTTP 404...');
}