

//require('../lib/jquery-1.12.1.min.js');
//require('jquery');
//require('expose?$!expose?jQuery!jquery')
//require('bootstrap');

console.log($);
require('jlightbox');
require('../../css/lib/jlightbox.css');
require('../../css/lib/global.css')
require('../lib/pagealert.js');
console.log(jLightBox.parse);
console.log(pageAlert);

(function(env) {
	var a = require('./a.js');
	console.log(a.color);

	console.log(require('./b.js').aa);
})(this);