var usersModel = require('../../models/users.js');
var vpath = '';

module.exports = function(app) {
	vpath = app.locals.vpath;
	app.get(vpath + '/mng/login', onGet);
	//app.post(vpath + '/mng/login', onPost);
}

function onGet(req, res) {
	var session = psession.get(req);
	var renderdata = {
		//'page_alert' : session.page_alert,
		'vpath': vpath,
		'page_title': '登入頁面'
	};
	res.render('mng/login',renderdata);
}