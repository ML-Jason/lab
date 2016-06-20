exports.getData = function(req) {
	if (!req.session.pagedata) req.session.pagedata = {};
	var _data = {};
	_data.head = {
		'title' : '',
		'vpath' : process.env.VPATH
	};
	_data.content = req.session.pagedata.content || {};
	_data.alert = req.session.pagedata.alert || {};

	delete req.session.pagedata.alert;

	return _data;
}

exports.setData = function(req, pdata) {
	req.session.pagedata = pdata;
}

exports.setContent = function(req, pdata) {
	if (! req.session.pagedata) req.session.pagedata = {};
	req.session.pagedata.content = pdata;
}

exports.setAlert = function(req, pdata) {
	if (!req.session.pagedata) req.session.pagedata = {};
	req.session.pagedata.alert = pdata;
}

exports.clearData = function(req) {
	req.session.pagedata = {};
}