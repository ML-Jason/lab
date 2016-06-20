/*
##       ####  ######   ##     ## ######## ########   #######  ##     ##
##        ##  ##    ##  ##     ##    ##    ##     ## ##     ##  ##   ##
##        ##  ##        ##     ##    ##    ##     ## ##     ##   ## ##
##        ##  ##   #### #########    ##    ########  ##     ##    ###
##        ##  ##    ##  ##     ##    ##    ##     ## ##     ##   ## ##
##        ##  ##    ##  ##     ##    ##    ##     ## ##     ##  ##   ##
######## ####  ######   ##     ##    ##    ########   #######  ##     ##

使用：
<a data-lightbox="group-name" data-title="相片標題" data-url="相片或影片網址">
	<img src="...">
</a>
data-lightbox為必要的，jLightBox用這個屬性做為判斷。

jLightBox.pars();
自動掃描頁面上的連結是否為lightbox的連結

有data-url則以data-url為優先，data-url除了圖片可帶入youtube或vimeo的連結。
如果沒有data-url則會自動去抓取<img>裡的src當作url。
*/
(function(env) {
	var _img;
	var _maxWidth = $(window).width()*.9;
	var _maxHeight = $(window).height() - 200;
	var _tween = false;
	var _imgloaded = false;
	var _type = "image";
	var _index = 0;
	var _groupnum = 1;
	jLightBox = {
		'group':'',
		'title':'',
		'url':'',
		'parse' : function() {
			$("a[data-lightbox]").off("click", onLinkClick);
			$("a[data-lightbox]").on("click", onLinkClick);
			console.log($("a[data-lightbox]").length);
		},
		'close' : function() {
			$(".jlightbox_close").off("click");
			$(".jlightbox").remove();
			_tween = false;
			_imgloaded = false;
			$(window).off("resize", onWindowResize);
			$(document).off("click", outsideClick);
		},
	};
	function onLinkClick(e) {
		e.stopPropagation();
		addLightBox();

		var _canvas = $(".jlightbox_canvas");
		$(".jlightbox_next").css({
			"left": _canvas.position().left+_canvas.width(),
			"top": _canvas.position().top+(_canvas.height() - 45)/2
		}).on("click", nextClick);
		$(".jlightbox_prev").css({
			"left": _canvas.position().left - 50,
			"top": _canvas.position().top+(_canvas.height() - 45)/2
		}).on("click", prevClick);
		$(".jlightbox_canvas").on("click", function(e) {
			e.stopPropagation();
		});
		$(document).on("click", outsideClick);

		var _target = $(e.currentTarget);
		changeSlide(_target);
	}
	function addVideo() {
		var _url = jLightBox.url;
		$(".jlightbox_loading").hide();
		var _size = calImgsize($(window).width(), $(window).height());
		if (_url.indexOf("youtube.com") >= 0) {
			_type = "youtube";
			var _videoId = _url.split("v=")[1].split("&")[0];
			
			var _vStr = '<iframe width="'+_size.width+'" height="'+_size.height+'" src="https://www.youtube.com/embed/'+_videoId+'" frameborder="0" allowfullscreen></iframe>';
		}
		if (_url.indexOf("vimeo.com") >= 0) {
			_type = "vimeo";
			var _videoId = _url.split("/")[_url.split("/").length-1];
			var _vStr = '<iframe src="https://player.vimeo.com/video/'+_videoId+'" width="'+_size.width+'" height="'+_size.height+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		}
		$(".jlightbox_content").empty().append($(_vStr)).hide();
		tweenCanvas(_size.canvas);
		_imgloaded = true;
	}
	function addImage() {
		_type = "image";
		_img = new Image();
		_imgloaded = false;
		$(".jlightbox_loading").show();
		_img.onload = function() {
			$(".jlightbox_loading").hide();

			_img.ow = _img.width;
			_img.oh = _img.height;
			var _size = calImgsize(_img.width, _img.height);
			$(".jlightbox_content").empty().hide();
			$(_img).appendTo($(".jlightbox_content")).css({
				"width":_size.width, "height":_size.height
			});
			tweenCanvas(_size.canvas);
			_imgloaded = true;
		}
		_img.src = jLightBox.url;
	}
	function switchTxt() {
		$(".jlightbox_title").html(jLightBox.title);
		if (_groupnum > 1)
			$(".jlightbox_pagination").html(jLightBox.group+" "+(_index+1).toString()+"/"+_groupnum);
	}
	function nextClick(e) {
		e.stopPropagation();
		_index ++;
		var _target = $("a[data-lightbox='"+jLightBox.group+"']").eq(_index);
		changeSlide(_target);
	}
	function prevClick(e) {
		e.stopPropagation();
		_index --;
		var _target = $("a[data-lightbox='"+jLightBox.group+"']").eq(_index);
		changeSlide(_target);
	}
	function outsideClick(e) {
		jLightBox.close();
	}
	function changeSlide(ptarget) {
		_target = ptarget;
		var _url = _target.attr("data-url");
		var _imgURL = _target.children("img").attr("src");
		if (! _url && ! _imgURL) return;
		if (_img) _img.onload = null;
		jLightBox.group = _target.attr("data-lightbox");
		jLightBox.title = _target.attr("data-title") || '';
		_index = $("a[data-lightbox='"+jLightBox.group+"']").index(_target);
		_groupnum = $("a[data-lightbox='"+jLightBox.group+"']").length;
		if (_url) {
			jLightBox.url = _url;
			addVideo();
		} else {
			jLightBox.url = _imgURL;
			addImage();
		}
		switchTxt();
		checkPagenation();
	}
	function checkPagenation() {
		$(".jlightbox_prev").hide();
		$(".jlightbox_next").hide();
		if (_groupnum > 1) {
			if (_index > 0)
				$(".jlightbox_prev").show();
			if (_index + 1< _groupnum)
				$(".jlightbox_next").show();
		}
	}
	function tweenCanvas(pcanvas) {
		var _canvas = pcanvas;
		_tween = true;
		$(".jlightbox_canvas").animate({
			"width":_canvas.width,
			"height":_canvas.height,
			"left":_canvas.left,
			"top":_canvas.top
		}, function() {
			_tween = false;
			$(".jlightbox_content").fadeIn();
		});
		$(".jlightbox_close").animate({
			"left": _canvas.left+_canvas.width - 27,
			"top" : _canvas.top+_canvas.height + 10
		});
		$(".jlightbox_context").animate({
			"left": _canvas.left,
			"top" : _canvas.top+_canvas.height + 10
		});
		$(".jlightbox_next").animate({
			"left": _canvas.left+_canvas.width,
			"top": _canvas.top+(_canvas.height - 45)/2
		});
		$(".jlightbox_prev").animate({
			"left": _canvas.left - 50,
			"top": _canvas.top+(_canvas.height - 45)/2
		});
	}
	function calImgsize(pwidth, pheight) {
		_maxWidth = $(window).width()*.9;
		_maxHeight = $(window).height() - 200;
		var _imgWidth = pwidth;
		var _imgHeight = pheight;
		if (_imgWidth > _maxWidth || _imgHeight > _maxHeight) {
			_imgHeight = _maxHeight;
			_imgWidth = pwidth*(_imgHeight/pheight);
			if (_imgWidth > _maxWidth) {
				_imgWidth = _maxWidth;
				_imgHeight = pheight*(_imgWidth/pwidth);
			}
		}
		var _canvas = {
			"width":_imgWidth+10,
			"height":_imgHeight+10,
			"left":($(window).width()-(_imgWidth+10))/2,
			"top":($(window).height()-(_imgHeight+10))/2
		};
		return {
			"width":_imgWidth, "height":_imgHeight, "canvas":_canvas
		}
	}
	function onWindowResize() {
		$(".jlightbox").css({
			"width":$(window).width(), "height":$(window).height()
		});
		if (_tween || !_imgloaded) return;
		var _size;
		if (_type == "image") {
			_size = calImgsize(_img.ow, _img.oh);
			$(_img).css({
				"width":_size.width, "height":_size.height
			});
		} else {
			_size = calImgsize($(window).width(), $(window).height());
			$(".jlightbox_content iframe").css({
				"width":_size.width, "height":_size.height
			});
		}

		var _canvas = _size.canvas;
		$(".jlightbox_canvas").css({
			"width":_canvas.width,
			"height":_canvas.height,
			"left":_canvas.left,
			"top":_canvas.top
		});
		$(".jlightbox_close").css({
			"left": _canvas.left+_canvas.width - 27,
			"top" : _canvas.top+_canvas.height + 10
		});
		$(".jlightbox_context").css({
			"left": _canvas.left,
			"top" : _canvas.top+_canvas.height + 10
		});
		$(".jlightbox_next").css({
			"left": _canvas.left+_canvas.width,
			"top": _canvas.top+(_canvas.height - 45)/2
		});
		$(".jlightbox_prev").css({
			"left": _canvas.left - 50,
			"top": _canvas.top+(_canvas.height - 45)/2
		});
	};
	function addLightBox() {
		jLightBox.close();
		var _lightboxStr = '<div class="jlightbox">'
    		+'	<div class="jlightbox_canvas">'
    		+'		<div class="jlightbox_content"></div>'
    		+'		<div class="jlightbox_loading"></div>'
    		+'	</div>'
    		+'	<div class="jlightbox_context">'
    		+'		<div class="jlightbox_title"></div>'
    		+'		<div class="jlightbox_pagination"></div>'
    		+'	</div>'
    		+'	<div class="jlightbox_next"></div>'
    		+'	<div class="jlightbox_prev"></div>'
    		+'	<div class="jlightbox_close"></div>'
    		+'</div>';
    	$("body").append($(_lightboxStr));
    	$(".jlightbox_close").on("click", function() { jLightBox.close(); });
    	$(window).on("resize", onWindowResize);

		$(".jlightbox").css({
			"width":$(window).width(),
			"height":$(window).height()
		}).fadeIn();
		$(".jlightbox_canvas").css({
			"left":($(window).width()-$(".jlightbox_canvas").outerWidth())/2,
			"top":($(window).height()-$(".jlightbox_canvas").outerHeight())/2,
		});
		$(".jlightbox_close").css({
			"left": $(".jlightbox_canvas").position().left + $(".jlightbox_canvas").outerWidth() - 27,
			"top" : $(".jlightbox_canvas").position().top + $(".jlightbox_canvas").outerHeight() + 10
		});
		$(".jlightbox_context").css({
			"left": $(".jlightbox_canvas").position().left,
			"top" : $(".jlightbox_canvas").position().top + $(".jlightbox_canvas").outerHeight() + 10
		});
	};

	env.jLightBox = jLightBox;
})(this);