var defaultTitle = '米蘭實驗室';
var defaultSitename = '米蘭實驗室';
exports.getData = function(req) {
	if (!req.session.pagedata) req.session.pagedata = {};
	var _data = {};
	_data.head = {
		'title' : defaultTitle,
		'vpath' : process.env.VPATH,
		'site_name' : defaultSitename,
		'url' : req.protocol + '://' + req.hostname + req.originalUrl
	};
	/*
	儲存暫時需要暫存的資料參數，例如頁數、每頁筆數... etc
	*/
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