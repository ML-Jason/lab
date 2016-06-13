var models = require('../../models/models.js');
var secure = require('../../lib/secure.js');
var vpath = '';

module.exports = function(app) {
	vpath = app.locals.vpath;
	app.all(vpath + '/mng/*', function(req, res, next) {
		var path = req.path;
		if (path.indexOf(vpath + '/mng/login') >= 0) {
			next();
			return;
		}
		if (! secure.isLogin(req))
			res.redirect(vpath + '/mng/login');
		else
			next();
	});

	app.all(vpath + '/mng/', function(req,res) {
		res.send('logined');
	});

	require('./login.js')(app);
	require('./users.js')(app);
	require('./ckeditor.js')(app);

	app.all(vpath + '/mng/logout', function(req, res) {
		secure.logout(req, res);
		var renderdata = {
			'vpath': vpath,
			'page_title': '登出'
		};
		res.render('mng/logout.html', renderdata);
	});
}