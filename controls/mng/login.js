var usersModel = require('../../models/users.js');
//var psession = require('../../lib/page_session.js');
var pagedata = require('../../lib/pagedata.js');
var vpath = process.env.VPATH;

module.exports = function(app) {
	app.get(vpath + '/mng/login', onGet);
	//app.post(vpath + '/mng/login', onPost);
}
function onGet(req, res) {
	/*var session = psession.get(req);
	var renderdata = {
		'vpath': vpath,
		'page_title': '登入頁面'
	};*/
	var _rdata = pagedata.getData(req);
	_rdata.head.title = '登入';
	res.render('mng/login',_rdata);
}