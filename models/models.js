var mongoose = require('mongoose');

exports.connect = function() {
	var opts = {
		server: {
			socketOptions : { keepAlive:1 }
		}
	};
	var db = mongoose.connection;
	db.on('error', function(error) {
		console.log('db error', error);
	});
	db.once('open', function() {
		console.log('db on open');
	});
	var conStr = 'mongodb://jason:change12@ds025389.mlab.com:25389/medialand_dev';
	//conStr = 'mongodb://jason:change12@localhost/jasondb';
	mongoose.connect(conStr, opts);
}