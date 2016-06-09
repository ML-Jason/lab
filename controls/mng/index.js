var models = require('../../models/models.js');
var secure = require('../../lib/secure.js');

module.exports = function(app) {
	var vpath = app.locals.vpath;
	app.all(vpath + '/mng/*', function(req, res, next) {
		next();
	});
	//app.all('/mng/*', secure.isLoginCheck);

	app.all(vpath + '/mng/', function(req,res) {
		res.send('logined');
	});

	require('./login.js')(app);
	require('./users.js')(app);
	require('./ckeditor.js')(app);

	app.all(vpath + '/mng/logout', function(req, res) {
		secure.logout(req, res);
		res.redirect(vpath + '/mng/login');
	});

	app.all(vpath + '/mng/google', function(req, res) {
		res.render('mng/google.html');
	});
}