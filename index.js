var express = require('express');
var app = express();
//app.enable('trust proxy')
var port = process.env.PORT || 3000;
process.env.NODE_ENV = app.get('env');
console.log('NODE_ENV='+process.env.NODE_ENV);

app.locals.vpath = '/jason';

//view engine
require('./lib/viewEngine.js')(app);

//add loggers
//require('./lib/logger.js')(app);

var helmet = require('helmet');
app.use(helmet());

//set static dirs
if (app.locals.vpath == '')
	app.use(express.static('./public'));
else
	app.use(app.locals.vpath,express.static('./public'));

//set middlewares
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }) );
app.use(bodyParser.json());
var expressValidator = require('express-validator');
app.use(expressValidator({
	customValidators : require('./lib/validator_ext.js')
}));
require('./lib/validator_ext.js').extendValidator();
app.use(require('cookie-parser')());

//use session
var session = require('express-session');
app.use(session({
	secret: 'express_p1',
	resave: true,
	saveUninitialized: true,
	cookie: {},
	genid: function(req) {
    	return require('./lib/secure.js').randomId()
  	}
}));

//add routers
require('./controls/')(app);

var server = app.listen(port, function () {
	console.log('Listening on port ' + port);
});
require('./socket/socket.js')(server);

//Connect DB
require('./models/models.js').connect();
