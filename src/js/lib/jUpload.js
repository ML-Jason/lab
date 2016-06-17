/*
      ## ##     ## ########  ##        #######     ###    ########
      ## ##     ## ##     ## ##       ##     ##   ## ##   ##     ##
      ## ##     ## ##     ## ##       ##     ##  ##   ##  ##     ##
      ## ##     ## ########  ##       ##     ## ##     ## ##     ##
##    ## ##     ## ##        ##       ##     ## ######### ##     ##
##    ## ##     ## ##        ##       ##     ## ##     ## ##     ##
 ######   #######  ##        ########  #######  ##     ## ########

使用：
var jupload = new jUpload({
	"target":"#file1",
	"uploadURL":"/jason/api/upload",
	"allowfiles":"jpg,png,gif,jpeg,bmp"
});
target : 要被置放的DOM
uploadURL : 上傳檔案的url
allowfiles : 可允許上傳的副檔名

jupload.on("change", function(e) {});
檔案改變的事件
jupload.on('wrongfile', function(e) {});
選了錯誤檔案的事件
jupload.on('error', function(e) {});
錯誤
jupload.on('complete', function(e) {});
上傳完成事件

jupload.add([
    { name:'/jason/uploads/1464004467005-41251.jpg' },
    { name:'/jason/uploads/1464004543637-86084.jpg' },
    { name:'/jason/uploads/小毛驢.mp4'}
]);
把已經在server上的檔案加入列表
*/
(function(env) {
	jUpload = function(param) {
		this.target = "";
		this.allowfiles = "jpg,png,gif,jpeg,bmp";
		this.uploadURL = "";

		var _context = '<div class="jfile_box">點選或是拖拉檔案到此</div>'
	        	+'	<input type="file" name="jfile" class="jfile_file_btn" multiple="multiple" style="display:none;">'
	        	+'	<div class="jfile_unitcontainer">'
	        	+'	</div>';
	    var _cloneunit = '<div class="jfile_unit">'
        			+'	<div class="jfile_thum"></div>'
	        		+'	<div class="jfile_info">'
	        		+'	<input type="hidden" name="files" class="jfile_files_hidden" value="">'
	        		+'		<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">'
	        		+'			<div class="progress-bar progress-bar-success" style="width:0%;"></div>'
	        		+'		</div>'
	        		+'		<div class="jfile_info_filename"></div>'
	        		+'		<div class="jfile_info_filesize"></div>'
	        		+'		<button class="btn btn-primary btn-sm jfile_upload_btn">'
	        		+'			<i class="glyphicon glyphicon-upload"></i>'
	        		+'			<span>Start</span>'
	        		+'		</button>'
	        		+'		<div class="btn btn-warning btn-sm jfile_cancel_btn">'
	        		+'			<i class="glyphicon glyphicon-ban-circle"></i>'
	        		+'			<span>Delete</span>'
	        		+'		</div>'
        			+'	</div>'
	        		+'</div>';
		var _this;
		var _files;
		var _imgExtends = "jpg,png,gif,jpeg,bmp";
		var _eventListensers;

		if (typeof param == 'string')
            this.target = param;
        else
            for (var itm in param) {
                this[itm] = param[itm];
            }

		this.init = function() {
			_files = [];
			_eventListensers = [];

			_this = this;
			$(_this.target).empty().append($(_context));
			$(_this.target + " .jfile_file_btn").on("change", onFiles);
			_cloneunit = $(_cloneunit);

			var filedrop = $(_this.target + " .jfile_box");
			filedrop.on("click", _this.openFileDialog).on("mouseenter", function() {
				$(_this.target + " .jfile_box").css({"border-color": "#0f3c4b"});
			}).on("mouseleave", function() {
				$(_this.target + " .jfile_box").css({"border-color": "#92b0b3"});
			});
            filedrop.on('dragenter', function (e) {
                $(_this.target + " .jfile_box").css({"border-color": "#0f3c4b"});
            });
            filedrop.on("dragleave", function(e) {
            	$(_this.target + " .jfile_box").css({"border-color": "#92b0b3"});
            });
            filedrop.on("dragover", function (e) {
                e.preventDefault();
            });
            filedrop.on("drop", onFiles);
			$(document).on("dragenter dragover drop", function(e) {
                e.stopPropagation();
                e.preventDefault();
            });
		};
		this.openFileDialog = function() {
        	$(_this.target + " .jfile_file_btn").click();
        };
		function onFiles(e) {
			$(_this.target + " .jfile_box").css({"border-color": "#92b0b3"});
			var files;
			if (e.originalEvent.dataTransfer)
				files = e.originalEvent.dataTransfer.files;
			else
				files = e.originalEvent.target.files;
			addFiles(files);

			$(_this.target + " .jfile_file_btn").val('');
		};
		this.add = function(efiles) {
            for (var i = 0;i < efiles.length;i++) {
                var _file = {
                    '_show' : true,
                    '_upload' : true,
                    'name' : efiles[i].name,
                    '_id' : Date.now() + '_' + Math.round(Math.random()*100000)
                }
                _files.push(_file);
                var _dom = _cloneunit.clone().addClass('id_'+_file._id);
                $(_dom).appendTo($(_this.target+" .jfile_unitcontainer")).fadeIn();
                $(".id_"+_file._id+" .jfile_info_filename").html(_file.name);
                var _ext = _file.name.split(".")[_file.name.split(".").length-1];
                if (_imgExtends.indexOf(_ext) >= 0) {
                	var _img = '<a data-lightbox="'+_file._id+'"><img src="'+_file.name+'"></a>';
                	$(".id_"+_file._id+" .jfile_thum").append($(_img));
                }
                $(".id_"+_file._id+" .jfile_cancel_btn").on("click", onCancelClick);
                $(".id_"+_file._id+" .jfile_upload_btn").hide();
                $(".id_"+_file._id+" .progress-bar").css("width","100%");
            }
            var event = new Event('change');
            event.files = _files;
            _this.dispatchEvent(event);
        }
		function addFiles(pfs) {
            var _wrong = [];
            for (var i = 0;i < pfs.length; i++){
                var _ext = pfs[i].name.split(".")[pfs[i].name.split(".").length-1].toLowerCase();
                if (_this.allowfiles.indexOf(_ext) >= 0) {
                    pfs[i]._show = false;
                    pfs[i]._upload = false;
                    _files.push(pfs[i]);
                } else {
                    _wrong.push(pfs[i].name);
                }
            }
            if (_wrong.length > 0) {
                var event = new Event('wrongfile');
                event.files = _wrong;
                _this.dispatchEvent(event);
            }
            for (var i = 0;i < _files.length; i++) {
                var _file = _files[i];
                if (! _file._show) {
                    _file._id = Date.now() + '_' + Math.round(Math.random()*100000);
                    var _dom = _cloneunit.clone().addClass('id_'+_file._id);
                    $(_dom).appendTo($(_this.target+" .jfile_unitcontainer")).fadeIn();
                    $(".id_"+_file._id+" .jfile_info_filename").html(_file.name);
                    $(".id_"+_file._id+" .jfile_info_filesize").html(Math.floor(_file.size/1000)+' KB');
                    if (_file.type.match('image.*')) {
                        var reader = new FileReader();
                        var _atag = '<a data-lightbox="'+_file._id+'"></a>';
                        $(".id_"+_file._id+" .jfile_thum").append($(_atag));
                        reader.onload = (function(thefile) {
                            return function(e) {
                                var _img = '<img src="'+e.target.result+'">';
                                $(".id_"+thefile._id+" .jfile_thum > a").append($(_img));
                            }
                        })(_file);
                        reader.readAsDataURL(_file);
                    }
                    $(".id_"+_file._id+" .jfile_cancel_btn").on("click", onCancelClick);
                    $(".id_"+_file._id+" .jfile_upload_btn").on("click", onUploadClick);
                    _file._show = true;
                }
            }
            var event = new Event('change');
            event.files = _files;
            _this.dispatchEvent(event);
        }
        function onCancelClick(e) {
            e.preventDefault();
            var _index = $(_this.target+" .jfile_cancel_btn").index($(e.currentTarget));
            _files.splice(_index, 1);
            $(_this.target+" .jfile_unit").eq(_index).fadeOut(function() {
                this.remove();
            });
            var event = new Event('change');
            event.files = _files;
            _this.dispatchEvent(event);
        }
        function onUploadClick(e) {
        	e.preventDefault();
        	var _index = $(_this.target+" .jfile_upload_btn").index($(e.currentTarget));

        	var uploadURL = _this.uploadURL;
            var formdata = new FormData();
            formdata.append('file', _files[_index], _files[_index].name);

            $.ajax({
                xhr: function() {
                    var xhrobj = $.ajaxSettings.xhr();
                    if (xhrobj.upload) {
                            xhrobj.upload.addEventListener('progress', function(event) {
                                var percent = 0;
                                var position = event.loaded || event.position;
                                var total = event.total;
                                if (event.lengthComputable) {
                                    percent = Math.ceil(position / total * 100);
                                }
                                setProgress(_index,percent);
                            }, false);
                        }
                    return xhrobj;
                },
                url: uploadURL,
                type: 'POST',
                data: formdata,
                contentType: false,
                processData: false,
                success: function(data){
                    setProgress(_index, 100);
                    _files[_index]._upload = true;
                    try {
                    	var _data = JSON.parse(data);
                    	$(_this.target+" .jfile_info_filename").eq(_index).html(_data[0].file);
                    	$(_this.target+" .jfile_files_hidden").eq(_index).val(_data[0].file);
                    	var event = new Event('complete');
            			event.index = _index;
            			event.file = _data[0];
            			_this.dispatchEvent(event);
            		} catch(e) {
            			var event = new Event('error');
            			event.msg = JSON.stringify(e);
            			_this.dispatchEvent(event);
            		}
                }
            });
        }
        function setProgress(index, percent) {
            $(_this.target+" .progress-bar").eq(index).css({'width' : percent + '%'});
            if (percent == 100) {
                $(_this.target+" .jfile_upload_btn").eq(index).fadeOut();
            }
            var event = new Event('progress');
            event.percent = percent;
            _this.dispatchEvent(event);
        }
        this.on = function(eType, cb) {
            _eventListensers.push({'type':eType,'callback':cb});
        }
        this.off = function(eType, cb) {
            for (var i = _eventListensers.length-1; i >= 0; i--) {
                var e = _eventListensers[i];
                if (e.type == eType) {
                    if (cb) {
                        if (e.callback == cb)
                            _eventListensers.splice(i, 1);
                    } else
                        _eventListensers.splice(i ,1);
                }
            }
        }
        this.dispatchEvent = function(event) {
            for (var i = _eventListensers.length-1; i >= 0; i--) {
                var e = _eventListensers[i];
                if (e.type == event.type)
                    e.callback(event);
            }
        }
		if (this.target)
            this.init();
        else
            console.log('jUpload Error : No element id/class');
	}
	env.jUpload = jUpload;
})(this);