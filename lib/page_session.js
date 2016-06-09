/*
處理每個頁面暫存的session資訊
*/
exports.get = function(req) {
	var path = req.path;
	if (path.lastIndexOf('/') == path.length-1)
		path = path.substr(0, path.length-1);
	var _p = req.session.p || {};
	var _new = {'path': path};
	if (_p.path == path) {
		for (var itm in _p) {
			_new[itm] = _p[itm];
		}
	}
	_new.page_alert = _new.page_alert || {};
	delete req.session.p;
	return _new;
}

exports.set = function(req, psession) {
	req.session.p = psession;
}

exports.clear = function(req) {
	delete req.session.p;
}