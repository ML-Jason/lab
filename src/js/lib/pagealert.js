(function(env) {
    var pageAlert = {
        checkOnPageLoad : function() {
            var _alertType = $("#pagealertdata").attr("data-type");
            var _alertTitle = $("#pagealertdata").attr("data-title");
            var _alertMsg = $("#pagealertdata").html();
            if (_alertMsg || _alertTitle) {
                pageAlert.show({
                    "title" : _alertTitle,
                    "text" : _alertMsg,
                    "type" : _alertType
                });
            }
        },
        show : function(obj, callback) {
            var _obj = {
                confirmButtonText: "OK",
                allowEscapeKey : true,
                allowOutsideClick : true
            }
            for (var itm in obj) {
                _obj[itm] = obj[itm];
            }
            swal(_obj).then(callback);
        },
        showError : function(obj, callback) {
            obj.type = "error";
            pageAlert.show(obj, callback);
            /*swal({
                //title: "錯誤!",
                //text: msg,
                title: msg,
                type: "error",
                confirmButtonText: "OK",
                allowEscapeKey : true,
                allowOutsideClick : true
            }).then(callback);*/
        },
        showConfirm : function(obj, callback) {
            obj.type = "warning";
            obj.showCancelButton = true;
            obj.confirmButtonColor = "#DD6B55";
            obj.confirmButtonText = "Yes";
            obj.cancelButtonText = "No";
            pageAlert.show(obj, callback);
            /*swal({
                title: msg,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                //closeOnConfirm: false,   closeOnCancel: false
            }).then(callback);*/
        }
    }
    env.pageAlert = pageAlert;
    $(function() {
        pageAlert.checkOnPageLoad();
    });
})(this);