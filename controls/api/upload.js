var formidable = require('formidable');

module.exports = function(app) {
	app.post(process.env.VPATH + '/api/upload', onUpload);
}

function onUpload(req, res) {
	console.log(req.cookies);
	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8';
	form.multiples = true;
	form.keepExtensions = false;
	form.maxFieldsSize = 2 * 1024 * 1024;
	var uploadUrl = process.env.VPATH + '/upload/';
	var uploadDir = './public/uploads';
	form.uploadDir = uploadDir;
	var fs = require('fs');
	if (!fs.existsSync(uploadDir))
		fs.mkdirSync(uploadDir);

	form.on('file', function(field, file) {
	    //rename the incoming file
	    var _extArry = file.name.split(".");
	    var _extName = _extArry[_extArry.length-1];
	    var _newname = Date.now()+'-'+Math.round(Math.random()*100000)+'.'+_extName;
	    file._newname = _newname;
	    fs.rename(file.path, form.uploadDir + "/" + _newname);
	});
	form.on('progress', function(bytesReceived, bytesExpected) {
		console.log(bytesReceived, bytesExpected);
	});
	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
			return res.redirect(303, '/error');
		}

		console.log('fields : ');
		console.log(fields);
		console.log('files : ');
		console.log(files);
		//res.redirect(303, '/done');
		var data = [];
		if (typeof files.file == "array") {
			for (var i =0;i < files.file.length; i++) {
				data.push({
					//'name':files[i].name,
					'size':files[i].size,
					//'new_name':files[i]._newname
					'file':uploadUrl + files[i]._newname
				});
			}
		} else
			data.push({
				//'name':files.file.name,
				'size':files.file.size,
				'file':uploadUrl + files.file._newname
			})
		res.send(JSON.stringify(data));
	});
}