var crypto = require('crypto');

exports.hash = function(pstr) {
	return crypto.createHash('sha1').update(pstr).digest('base64');
}

exports.randomId = function() {
	var str = Date.now().toString();
	str += '-'+Math.round(Math.random()*10000).toString();
	return this.hash(str);
}

exports.isLoginCheck = function(req, res, next) {
	var path = req.path;
	if (path.indexOf('/mng/login') >=0 || path.indexOf('/mng/logout') >=0) {
		next();
		return;
	}
	//if (req.cookies._u)
	if (req.session._u)
		next();
	else
		res.redirect('/mng/login');
	/*
	var _u = req.cookies._u;
	try {
		_obj = JSON.parse(_u);
		if (_obj._id)
			next();
		else
			res.redirect('/mng/login');
	} catch(e) {
		console.log('parse _u to JSON failed');
		res.redirect('/mng/login');
	}*/
}
exports.saveLogin = function(req, res, data) {
	/*var _str = JSON.stringify({
		_id : data._id,
		_un : data.username,
		_nn : data.nickname,
		_au : data.authlevel
	});
	res.cookie('_u', _str);*/
	req.session._u = data;
}
exports.logout = function(req, res) {
	delete req.session._u;
	//res.clearCookie('_u');
}