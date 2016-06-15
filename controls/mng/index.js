var models = require('../../models/models.js');
var secure = require('../../lib/secure.js');
//var psession = require('../../lib/page_session.js');
var pagedata = require('../../lib/pagedata.js');
var vpath = process.env.VPATH;

module.exports = function(app) {
	app.all(vpath + '/mng/*', function(req, res, next) {
		var path = req.path;
		if (path.indexOf(vpath + '/mng/login') >= 0) {
			next();
			return;
		}
		if (! secure.isLogin(req))
			res.redirect(vpath + '/mng/login');
		else {
			res.cookie('_path', path);
			next();
		}
	});

	app.all(vpath + '/mng/', function(req,res) {
		res.send('logined');
	});

	require('./login.js')(app);
	require('./users.js')(app);
	require('./ckeditor.js')(app);

	app.all(vpath + '/mng/logout', function(req, res) {
		secure.logout(req, res);
		res.cookie('_path', '');
		var _rdata = pagedata.getData(req);
		_rdata.head.title = '登出';
		res.render('mng/logout', _rdata);
	});
}