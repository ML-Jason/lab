(function(env) {
    var pageAlert = {
        checkOnPageLoad : function() {
            var _alertType = $("#pagealertdata").attr("data-type");
            var _alertMsg = $("#pagealertdata").html();
            if (_alertMsg) {
                swal({
                    //title: "Warning!",
                    title: _alertMsg,
                    type: _alertType,
                    confirmButtonText: "OK" 
                });
            }
        },
        showError : function(msg) {
            swal({
                //title: "錯誤!",
                //text: msg,
                title: msg,
                type: "error",
                confirmButtonText: "OK",
                allowEscapeKey : true,
                allowOutsideClick : true
            });
        },
        showConfirm : function(msg, callback) {
            swal({
                title: msg,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                //closeOnConfirm: false,   closeOnCancel: false
            }, callback);
        }
    }
    env.pageAlert = pageAlert;
    $(function() {
        pageAlert.checkOnPageLoad();
    });
})(this);