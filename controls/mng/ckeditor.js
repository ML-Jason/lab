var vpath = '';

module.exports = function(app) {
	vpath = app.locals.vpath;
	app.get(vpath + '/mng/ck', onGet);
	app.post(vpath + '/mng/ck', onPost);
}

function onGet(req, res) {
	var _d = {
		'vpath': vpath,
		'page_title': 'CKEDitor'
	}
	res.render('mng/ckeditor.html', _d);
}

function onPost(req, res) {
	req.sanitizeBody('editor1').escape();
	var ee = req.body.editor1;
	//ee = ee.replace(/<script/g, '&lt;script');
	//ee = ee.replace(/<\/script/g, '&lt;/script');
	res.send(ee);
}