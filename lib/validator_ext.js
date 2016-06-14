var validator = require('validator');
module.exports = {
	isLoginId : function(input) {
		var re = /^[a-zA-Z]+[a-zA-Z0-9_\-\.]*$/;
		return re.test(input);
	},
	isPassword : function(input) {
		var re = /^[a-zA-Z0-9_\-@]+$/;
		return re.test(input);
	},
	isMedialandEmail : function(input) {
		if (input.indexOf('@medialand.tw') > 0)
				return true;
		return false;
	},
	extendValidator : function() {
		for (var itm in this) {
			if (itm != 'extendValidator')
				validator[itm] = this[itm];
		}
	}
}