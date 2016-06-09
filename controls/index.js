var formidable = require('formidable');
var express = require('express');

module.exports = function(app) {
	app.all('/', function(req, res) {
		res.send("index");
	});
	app.use(function(req, res, next) {
		console.log(req.path);
		next();
	});

	require('./mng/')(app);

	/*app.get('/api/:type/upload', function(req, res) {
		console.log(req.params.type);
		var str = '<form action="/upload" method="post" enctype="multipart/form-data">'+
    		'<input type="file" name="upload" multiple="multiple"><br>'+
    		'<input type="file" name="upload" multiple="multiple"><br>'+
    		'<input type="submit" value="Upload File">'+
    		'</form>';
    	res.send(str);
	});*/
	app.post('/getform', function(req, res) {
		console.log(req.body.filepaths);
		res.send('form');
	});
	app.get('/upload', function(req,res) {
		res.render('mng/upload');
	});
	app.post('/upload', function(req, res) {
		var form = new formidable.IncomingForm();
		form.multiples = true;
		form.maxFieldsSize = 2 * 1024 * 1024;
		var uploadDir = './public/uploads';
		var fs = require('fs');
		if (!fs.existsSync(uploadDir))
    		fs.mkdirSync(uploadDir);

		form.uploadDir = uploadDir;
		form.on('file', function(field, file) {
            //rename the incoming file to the file's name
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
						'name':files[i].name,
						'size':files[i].size,
						'new_name':files[i]._newname
					});
				}
			} else
				data.push({
					'name':files.file.name,
					'size':files.file.size,
					'new_name':files.file._newname
				})
			res.send(JSON.stringify(data));
		});
	});

	app.use(http500);
	app.use(http404);
}
function http500(err, req, res, next) {
	console.log(err.stack);
	res.status(500).send('HTTP 500...');
}
function http404(req, res) {
	console.log(req.path);
	console.log('404');
	res.status(404).send('HTTP 404...');
}