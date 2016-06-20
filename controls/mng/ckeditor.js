var pagedata = require('../../lib/pagedata.js');
var vpath = process.env.VPATH;

module.exports = function(app) {
	app.get(vpath + '/mng/ck', onGet);
	app.post(vpath + '/mng/ck', onPost);
}

function onGet(req, res) {
	var _rdata = pagedata.getData(req);
	_rdata.head.title = 'CKEDitor';
	res.render('mng/ckeditor', _rdata);
}

function onPost(req, res) {
	req.sanitizeBody('editor1').escape();
	var ee = req.body.editor1;
	//ee = ee.replace(/<script/g, '&lt;script');
	//ee = ee.replace(/<\/script/g, '&lt;/script');
	res.send(ee);
}