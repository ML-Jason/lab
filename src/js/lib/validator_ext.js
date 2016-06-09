validator.isLoginId = function(input) {
    var re = /^[a-zA-Z]+[a-zA-Z0-9_\-\.]*$/;
    return re.test(input);
}
validator.isPassword = function(input) {
    var re = /^[a-zA-Z0-9_\-@]+$/;
    return re.test(input);
}