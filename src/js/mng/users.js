var confirmtype = "";
var selIndex = -1;
$(document).ready(function() {
    $(".btn-del").on("click", delBtnClick);
    $(".j-btn-confirm").on("click", delConfirmClick);
    $(".btn-selectall").on("click", selectallBtnClick);
    $(".btn-delselect").on("click", delselectedBtnClick);
    $(".pagesize-select").on('change', onPageChange);
    $(".page-select").on('change', onPageChange);
});
function onPageChange() {
    var _psize = $(".pagesize-select").find("option:selected").text();
    var _p = $(".page-select").find("option:selected").text();
    location.href = '?pagesize='+_psize+'&page='+_p;
}
function delBtnClick(e) {
    e.preventDefault();
    var _index = $(".btn-del").index($(e.currentTarget));
    confirmtype = "del";
    selIndex = _index;
    pageAlert.showConfirm("確定要刪除嗎",delConfirmClick);
}
function delConfirmClick(e) {
    if (confirmtype == "del") {
        var _id = $(".item-checkbox").eq(selIndex).val();
        var _url = $("#usersform").prop("action");
        document.location.href= _url + _id;
    }
    if (confirmtype == "delselected") {
        $("#usersform").submit();
    }
}
function delselectedBtnClick(e) {
    var _selected = false;
    for (var i= 0;i < $(".item-checkbox").length;i ++) {
        if ($(".item-checkbox").eq(i).prop("checked")) {
            _selected = true;
            break;
        }
    }
    if (! _selected) return;
    confirmtype = "delselected";
    pageAlert.showConfirm("確定要刪除嗎",delConfirmClick);
}
function selectallBtnClick(e) {
    if ($(".btn-selectall").eq(0).html() == '全選') {
        $(".btn-selectall").html('取消全選');
        $(".item-checkbox").prop("checked", true);
    } else {
        $(".btn-selectall").html('全選');
        $(".item-checkbox").prop("checked", false);
    }
}