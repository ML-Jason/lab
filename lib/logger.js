var morgan = require('morgan');
var winston = require('winston');
winston.emitErrs = true;

module.exports = function(app) {
	var logger = new winston.Logger({
		transports: [
	        new winston.transports.File({
	            level: 'info',
	            filename: './logs/all-logs.log',
	            handleExceptions: true,
	            json: true,
	            maxsize: 5242880, //5MB
	            maxFiles: 5,
	            colorize: false
	        }),
	        new winston.transports.Console({
	            level: 'debug',
	            handleExceptions: true,
	            json: false,
	            colorize: true
	        })
	    ],
	    exitOnError: false
	});
	logger.stream = {
	    write: function(message, encoding){
	        logger.info(message);
	    }
	};
	if (app.get('env') == 'production') {
		app.use(morgan('combined', { 
	  		skip: function(req, res) { return res.statusCode < 400 }, 
	  		stream: logger.stream
	  		})
		);
	} else {
		app.use(morgan('dev'));
	}
}