var crypto = require('crypto');

exports.hash = function(pstr) {
	return crypto.createHash('sha1').update(pstr).digest('base64');
}

exports.randomId = function() {
	var str = Date.now().toString();
	str += '-'+Math.round(Math.random()*10000).toString();
	return this.hash(str);
}
exports.isLogin = function(req) {
	if (req.session._u)
		return true;
	return false;
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