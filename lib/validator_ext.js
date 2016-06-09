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
    extendValidator : function() {
        for (var itm in this) {
            if (itm != 'extendValidator') {
                validator[itm] = this[itm];
            }
        }
    }
}