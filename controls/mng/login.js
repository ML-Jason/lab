var usersModel = require('../../models/users.js');
var secure = require('../../lib/secure.js');
var psession = require('../../lib/page_session.js');
var vpath = '';

module.exports = function(app) {
	vpath = app.locals.vpath;
	app.get(vpath + '/mng/login', onGet);
	app.post(vpath + '/mng/login', onPost);
}

function onGet(req, res) {
	var session = psession.get(req);
	var renderdata = {
		'page_alert' : session.page_alert,
		'username': session.username || '',
		'vpath': vpath,
		'page_title': 'Login Page'
	};
	res.render('mng/login',renderdata);
	delete req.session.res;
}

function onPost(req, res) {
	var uname = req.body.username;
	var pwd = req.body.password;

	req.checkBody('username', '無效的Username').isLoginId().isLength({min:6, max:20});
	req.checkBody('password', '無效的密碼').isPassword().isLength({min:6, max:20});

	var errors = req.validationErrors();
	if (errors) {
		var _p = {
			'path' : vpath + '/mng/login',
			'page_alert' : {
				'msg': '登入失敗'
			},
			'username' : uname
		}
		psession.set(req, _p);
		res.redirect(vpath + '/mng/login');
    	return;
  	}
  	pwd = secure.hash(pwd);

	usersModel.auth({username:uname, pwd:pwd}, function(err, data) {
		if (data.length > 0) {
			var _d = data[0];
			usersModel.updateLogindate({_id:_d._id});
			psession.clear(req);
			secure.saveLogin(req, res, _d);
			res.redirect('/mng/');
		} else {
			var _p = {
				'path' : vpath + '/mng/login',
				'page_alert' : {
					'msg': '登入失敗'
				},
				'username' : uname
			}
			psession.set(req, _p);
			res.redirect(vpath + '/mng/login');
		}
	});
}