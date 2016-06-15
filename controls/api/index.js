var usersModel = require('../../models/users.js');
var secure = require('../../lib/secure.js');
var https = require('https');

module.exports = function(app) {
	app.all(process.env.VPATH + '/api/tokensignin', tokensignin);
}

function tokensignin(req, res) {
	var _token = req.body.idtoken;
	var options = {
		host: 'www.googleapis.com',
		path: '/oauth2/v3/tokeninfo?id_token='+_token,
		method: 'GET'
	};
	https.request(options, function(response) {
		var str = '';
		response.on('data', function (chunk) {
  			str += chunk;
		});
		response.on('end', function () {
			var _obj = {'status':'ERROR', 'message':'Invalid token'};
      		var _data = {};
			try {
				var _data = JSON.parse(str);
      		} catch(e) {}
			//_data.email
			//_data.name
			//_data.picture
			if (_data.email.indexOf('@medialand.tw') > 0) {
        		usersModel.findOne({'email':_data.email}, '_id', function(err, data) {
					if (data) {
						var _logindata = {'_token':_token, '_name':_data.name, '_email':_data.email, '_id':data._id};
						secure.saveLogin(req, res, _logindata);
						_obj = {'status':'OK', 'name':_data.name, 'email':_data.email, 'id':data._id};
						res.send(JSON.stringify(_obj));
					} else {
						_obj = {'status':'ERROR', 'message':'未知的錯誤'};
						res.send(JSON.stringify(_obj));
					}
				});
			} else {
				_obj = {'status':'ERROR', 'message':'不是實驗室成員'};
        		res.send(JSON.stringify(_obj));
			}
		});
	}).end();
}