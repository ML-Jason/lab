var lobbyName = 'Lobby';
var usersDic = {};

module.exports = function(server) {
	var io = require("socket.io")(server);

	io.on('connection', function(socket){
		usersDic[socket.id] = {
			'id' : socket.id,
			'ip' : socket.request.connection.remoteAddress,
			'uname' : '',
			'room' : ''
		}

	    var onevent = socket.onevent;
	    //joinRoom(socket, lobbyName);
	    console.log(socket.id + ' connected');
	    console.log('connections : ' + io.engine.clientsCount);

	    socket.onevent = function (packet) {
	        var args = packet.data || [];
	        onevent.call (this, packet);
	        packet.data = ["*"].concat(args);
	        onevent.call(this, packet);
	    };
	    socket.on('_getid', function(cb) {
	    	cb(socket.id);
	    });
	    socket.on('_request_join', function(param, cb) {
	    	var robj = {
	    		'msg' : 'reject'
	    	};
	    	if (param.uname) {
	    		usersDic[socket.id].uname = param.uname;
	    		robj = {
	    			'id' : socket.id,
	    			'msg' : 'accept'
	    		};
	    	}
	    	if (cb) cb(robj);
	    });
	    socket.on('disconnect', function(e){
	    	console.log(socket.id + ' closed');
	    	emitToRoom(socket, '_user_disconnect');
	    	console.log('connections : ' + io.engine.clientsCount);
	    	delete usersDic[socket.id];
	    });
	    socket.on('_join', function(room, cb) {
	    	var robj = {
	    		'msg' : 'accept'
	    	};
	    	if (usersDic[socket.id].uname =='') {
	    		if (cb)
	    			cb({'msg' : 'reject'});
	    		return;
	    	}
	    	joinRoom(socket, room);
	    	if (cb) cb(robj);
	    });
	    socket.on('_leave', function() {
	    	if (usersDic[socket.id].uname =='') return;
	    	joinRoom(socket, lobbyName);
	    });
	    socket.on('_userlist', function(cb) {
    		var _ss = io.sockets.adapter.rooms[usersDic[socket.id].room].sockets;
    		var _list = [];
    		for (var itm in _ss) {
    			var _obj = {
    				'uname' : usersDic[itm].uname,
    				'id' : usersDic[itm].id,
    			};
    			_list.push(_obj);
    		}
    		cb(_list);
    	});
    	socket.on('_roomlist', function(cb) {
    		var rooms = io.sockets.adapter.rooms;
    		var _r = [];
    		if (rooms) {
    			for (var itm in rooms) {
    				if (! rooms[itm].sockets.hasOwnProperty(itm)) {
    					_r.push( {
    						'name' : itm,
    						'length' : rooms[itm].length
    					} );
    				}
    			}
    		}
    		if (cb) {
    			cb(_r);
    		}
    	});
    	socket.on('_onlyto', function() {
    		var args = Array.prototype.slice.call(arguments);
    		args.splice(1, 0, '_onlyto');
    		args.splice(0, 0, socket);
    		emitToSocket.apply(null, args);
    	});
    	socket.on('_toall', function() {
    		var args = Array.prototype.slice.call(arguments);
    		args.splice(0, 0, socket);
    		args.push({
				'id' : socket.id,
				'uname' : usersDic[socket.id].uname
			});
    		emitToAll.apply(this, args);
    	});
    	socket.on('_sys', function() {
    		var args = Array.prototype.slice.call(arguments);
    		args.splice(0, 0, '_sys');
    		systemToAll.apply(null, args);
    	});

	    socket.on("*", function() {
	        //console.log("Socket data");
	        //console.log(arguments);
	        var event = arguments[0];
	        if (event == '_join') return;
	        if (event == '_leave') return;
	        if (event == '_userlist') return;
	        if (event == '_setname') return;
	        if (event == '_onlyto') return;
	        if (event == '_roomlist') return;
	        if (event == '_toall') return;
	        if (event == '_sys') return;
	        var args = Array.prototype.slice.call(arguments);
	    	args.splice(0, 0, socket);
	        emitToRoom.apply(null, args);
	    });
	});
	function systemToAll() {
		var args = Array.prototype.slice.call(arguments);
		io.emit.apply(io, args);
	}
	function emitToAll(socket) {
		var args = Array.prototype.slice.call(arguments);
		args.splice(0, 1);
		args.splice(0, 0, '_toall');
    	args.push({
			'id' : socket.id,
			'uname' : usersDic[socket.id].uname
		});
		io.emit.apply(io, args);
	}
	function emitToSocket(socket) {
		var args = Array.prototype.slice.call(arguments);
		var _id = args[1];
		args.splice(0,2);
		args.push({
			'id' : socket.id,
			'uname' : usersDic[socket.id].uname
		});
		socket.to(_id).emit.apply(socket, args);
	}
	function emitToRoom(socket) {
		if (usersDic[socket.id].room == '') return;
		var args = Array.prototype.slice.call(arguments);
		args.splice(0,1);
		args.push({
			'id' : socket.id,
			'uname' : usersDic[socket.id].uname
		});
		socket.to(usersDic[socket.id].room).emit.apply(socket, args);
	}
	function joinRoom(socket, room) {
		if (usersDic[socket.id].room == room) return;
		var _roomChanged = false;
		emitToRoom(socket, '_user_leave');
		console.log('leave ' + usersDic[socket.id].room + ' to ' + room);
		var _rooms = io.sockets.adapter.rooms;
		if (usersDic[socket.id].room) {
			if (_rooms[usersDic[socket.id].room].length == 1) {
				//room empty
				_roomChanged = true;
			}
			socket.leave(usersDic[socket.id].room);
		}
		if (! _rooms[room]) {
			//new room
			_roomChanged = true;
		}
		socket.join(room);
		usersDic[socket.id].room = room;
		emitToRoom(socket, '_user_join');
		if (_roomChanged) {
			systemToAll('_roomlist_change');
		}
	}
}