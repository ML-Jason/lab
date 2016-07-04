var mongoose = require('mongoose');

exports.connect = function() {
	var opts = {
		server: {
			socketOptions : { keepAlive: 300000, connectTimeoutMS: 30000 }
		}
	};
	var db = mongoose.connection;
	db.on('error', function(error) {
		console.log('MongoDB error', error);
	});
	db.once('open', function() {
		console.log('MongoDB on open');
	});
	db.on('reconnected', function () {
		console.log('MongoDB reconnected');
	});
	db.on('disconnected', function() {
		console.log('MongoDB disconnected');
		//mongoose.connect(dbURI, {server:{auto_reconnect:true}});
	});
	var conStr = 'mongodb://jason:change12@ds025389.mlab.com:25389/medialand_dev';
	//conStr = 'mongodb://jason:change12@localhost/jasondb';
	mongoose.connect(conStr, opts);
}