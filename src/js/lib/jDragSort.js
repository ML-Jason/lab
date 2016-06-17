
/*
      ## ########  ########     ###     ######    ######   #######  ########  ########
      ## ##     ## ##     ##   ## ##   ##    ##  ##    ## ##     ## ##     ##    ##
      ## ##     ## ##     ##  ##   ##  ##        ##       ##     ## ##     ##    ##
      ## ##     ## ########  ##     ## ##   ####  ######  ##     ## ########     ##
##    ## ##     ## ##   ##   ######### ##    ##        ## ##     ## ##   ##      ##
##    ## ##     ## ##    ##  ##     ## ##    ##  ##    ## ##     ## ##    ##     ##
 ######  ########  ##     ## ##     ##  ######    ######   #######  ##     ##    ##

使用：
var jdrag = new jDragSort({
	"container":".jfile_unitcontainer",
	"unit":".jfile_unit"
});
container : 外層
unit : 可被拖動的物件

jdrag.update();
重新掃描可被拖動的物件
*/
(function(env) {
	jDragSort = function(param) {
		var _container = param.container;
		var _unit = param.unit;
		var _draggedUnit;
		var _mouse = {};
		var _dragging = false;
		var _index = 0;
		var _eventListensers = [];
		var _timer = 0;

		function init() {
			_eventListensers = [];
			$(_container).addClass("dragcontainer");
			$(_unit).addClass("dragunit");
		};
		this.start = function() {
			this.stop();
			$(".dragunit").on("mousedown", onMouseDown);
		};
		this.stop = function() {
			$(".dragunit").off("mousedown", onMouseDown);
		};
		this.update = function() {
			$(_unit).addClass("dragunit");
			this.start();
		}
		function onMouseDown(e) {
			e.preventDefault();
			_draggedUnit = $(e.currentTarget);
			_mouse.pageX = e.pageX;
			_mouse.pageY = e.pageY;
			$(document).on("mouseup", onMouseUp);
			$(document).on("mousemove", onMouseMove);

			_timer = setTimeout(startDrag, 500);
		}
		function startDrag() {
			_index = $(".dragunit").index(_draggedUnit);

			var pos = _draggedUnit.position();
			var offset = _draggedUnit.offset();
			$('<div class="dragtmp dragunit"></div>').css({
				"width":_draggedUnit.outerWidth(),
				"height":_draggedUnit.outerHeight()
			}).insertAfter(_draggedUnit).show();

			$('<div class="dragged"></div>').css({
				"left":offset.left,
				"top":offset.top,
				"width":_draggedUnit.outerWidth(),
				"height":_draggedUnit.outerHeight()
			}).appendTo($("body")).append(_draggedUnit).show();

			_mouse.offsetX = _mouse.pageX - offset.left;
			_mouse.offsetY = _mouse.pageY - offset.top;
			_dragging = true;
			//$("body").css("overflow", "hidden");
		}
		function onMouseUp(e) {
			clearTimeout(_timer);
			$(document).off("mouseup", onMouseUp);
			$(document).off("mousemove", onMouseMove);
			if (!_dragging) return;
			//$("body").css("overflow", "visible");
			_dragging = false;
			$(_draggedUnit).insertAfter($(".dragtmp"));
			$(".dragged").remove();
			$(".dragtmp").remove();
		};
		function onMouseMove(e) {
			_mouse.pageX = e.pageX;
			_mouse.pageY = e.pageY;
			if (!_dragging) return;
			var _containerPos = $(".dragcontainer").offset();
			var _mx = e.pageX - _containerPos.left;
			var _my = e.pageY - _containerPos.top;
			var _x = e.pageX -  _mouse.offsetX;
			var _y = e.pageY -  _mouse.offsetY;
			
			$(".dragged").css({
				"left": _x,
				"top": _y
			});
			for (var i = 0;i < $(".dragcontainer > .dragunit").length; i++) {
				var _u = $(".dragcontainer > .dragunit").eq(i);
				if (i != _index) {
					var _b = _u.position().top + _u.outerHeight()/2;
					var _height = _draggedUnit.outerHeight();
					var _nowY = _y - _containerPos.top + _height/2;
					if (i > _index) {
						if (_nowY > _b) {
							var _out = $(".dragtmp");
							var _newtmp = _out.clone();
							_out.removeClass("dragunit dragtmp").animate({"height":0}, function() {
								_out.remove();
							});
							_newtmp.insertAfter(_u).css({
								"height":0
							}).animate({"height":_height});
							_index = i;
						}
					}
					if (i < _index) {
						if (_nowY < _b) {
							var _out = $(".dragtmp");
							var _newtmp = _out.clone();
							_out.removeClass("dragunit dragtmp").animate({"height":0}, function() {
								_out.remove();
							});
							_newtmp.insertBefore(_u).css({
								"height":0
							}).animate({"height":_height});
							_index = i;
						}
					}
				}
			}
		};
		init();
	}
	env.jDragSort = jDragSort;
})(this);