
module.exports = function(app) {
	//useHandlebars(app);
	useEjs(app);
}

function useEjs(app) {
	var ejs = require('ejs');
	app.set('view engine', 'html');
	app.engine('html', ejs.renderFile);
}

//use handlebars as view engine
function useHandlebars(app) {
	var hbsHelpers = require('./handlebarsHelper.js');
	var exphbs  = require('express-handlebars');
	var hbs = exphbs.create({
		extname : '.html',
		helpers : {
			'timesLoop' : hbsHelpers.timesLoop,
			'forLoop' : hbsHelpers.forLoop
		}
	});
	app.engine('html', hbs.engine);
	app.set('view engine', 'html');
}