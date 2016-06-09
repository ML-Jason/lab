var usersModel = require('../../models/users.js');
var secure = require('../../lib/secure.js');
var validator = require('validator');
var psession = require('../../lib/page_session.js');
var vpath = '';

module.exports = function(app) {
	vpath = app.locals.vpath;

	app.all(vpath + '/mng/users', userslist);
	
	app.post(vpath + '/mng/users/del', delUsers);
	app.all(vpath + '/mng/users/del/:id', deloneUser);

	app.get(vpath + '/mng/users/add', addUserGet);
	app.post(vpath + '/mng/users/add', addUserPost);

	app.get(vpath + '/mng/users/:id', modUserGet);
	app.post(vpath + '/mng/users/:id', modUserPost);
}

/*
http://patorjk.com/software/taag/
██╗     ██╗███████╗████████╗
██║     ██║██╔════╝╚══██╔══╝
██║     ██║███████╗   ██║   
██║     ██║╚════██║   ██║   
███████╗██║███████║   ██║   
╚══════╝╚═╝╚══════╝   ╚═╝   
ANSI Shadow
http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow&t=list
Banner3
http://patorjk.com/software/taag/#p=display&f=Banner3&t=JASON
*/
function userslist(req, res) {
	var _ps = psession.get(req);
	_ps.page = _ps.page || 1;
	_ps.pagesize = _ps.pagesize || 10;

	if (req.query.page)
		if (validator.isInt(req.query.page, {min : 1})) _ps.page = req.query.page;
	if (req.query.pagesize)
		if (validator.isInt(req.query.pagesize, {min : 1})) _ps.pagesize = req.query.pagesize;
	
	usersModel.getUsersList(_ps.page, _ps.pagesize ,function(err, data) {
		_ps.page = data.page;
		_ps.pagesize = data.pagesize;
		if (data.page < data.totalpage)
    		data.next = vpath + '/mng/users/?page='+(parseInt(data.page)+1).toString()+'&pagesize='+data.pagesize;
    	if (data.page > 1)
    		data.prev = vpath + '/mng/users/?page='+(parseInt(data.page)-1).toString()+'&pagesize='+data.pagesize;
		//data.alert_msg = _ps.alert_msg || '';
		data.page_alert = _ps.page_alert;
		data.page_title = "使用者列表";
		data.vpath = vpath;

		delete _ps.page_alert;
		psession.set(req, _ps);
		res.render('mng/users', data);
	});
}

/*
██████╗ ███████╗██╗     ███████╗████████╗███████╗
██╔══██╗██╔════╝██║     ██╔════╝╚══██╔══╝██╔════╝
██║  ██║█████╗  ██║     █████╗     ██║   █████╗  
██║  ██║██╔══╝  ██║     ██╔══╝     ██║   ██╔══╝  
██████╔╝███████╗███████╗███████╗   ██║   ███████╗
╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
*/

function delUsers(req,res) {
	var uids = [];
	if (req.body.uids) {
		if (typeof req.body.uids === 'string') {
			uids = [req.body.uids];
		} else {
			if (Array.isArray(req.body.uids))
				uids = req.body.uids;
			else
				return onErrorRedirect();
		}
	} else
		return onErrorRedirect();

	for (var i= 0;i < uids.length; i++) {
		var _res = validator.isAlphanumeric(uids[i]);
		if (! _res)
			return onErrorRedirect();
	}
	usersModel.delById(req.body.uids, function(err, data) {
		var _ps = {
  			'path' : vpath + '/mng/users',
  			'page_alert' : { 'msg': '刪除成功' }
  		}
  		psession.set(req, _ps);
		res.redirect(vpath + '/mng/users');
	});
}

function deloneUser(req, res) {
	//網址亂打
	req.checkParams('id', 'Invalid id').notEmpty().isAlphanumeric();
	if (req.validationErrors()) {
		return onErrorRedirect();
	}
	var _id = req.params.id;
	usersModel.delById([_id], function(err, data) {
		var _ps = {
  			'path' : vpath + '/mng/users',
  			'page_alert' : { 'msg': '刪除成功' }
  		}
  		psession.set(req, _ps);
		res.redirect(vpath + '/mng/users');
	});
}

/*
 █████╗ ██████╗ ██████╗ 
██╔══██╗██╔══██╗██╔══██╗
███████║██║  ██║██║  ██║
██╔══██║██║  ██║██║  ██║
██║  ██║██████╔╝██████╔╝
╚═╝  ╚═╝╚═════╝ ╚═════╝                       
*/
function addUserGet(req, res) {
	var _data = {
		'username' : '', 'nickname' : '', 'alert_msg' : '', 'mode' : 'add'
	}
	var _ps = psession.get(req);
	_data.username = _ps.username || '';
	_data.nickname = _ps.nickname || '';
	_data.page_alert = _ps.page_alert || '';
	_data.vpath = vpath;
	_data.page_title = '新增使用者';
	
	res.render('mng/users_add.html', _data);
}
function addUserPost(req, res) {
	var _user = {
		'username' : req.body.username,
		'nickname' : req.body.nickname,
		'pwd' : req.body.password
	}

	req.checkBody('username', '無效的Username').isLoginId().isLength({min:6, max:20});
	req.checkBody('nickname', 'nickname空白').notEmpty();
	req.checkBody('password', '無效的密碼').isPassword().isLength({min:6, max:20});

	var errors = req.validationErrors();
	if (errors) {
		var errmsg = '';
		for (var i= 0;i < errors.length; i++) {
			errmsg += errors[i].msg + '<br/>';
		}
		var _ps = {
			'path' : vpath + '/mng/users/add',
			'page_alert' : { 'msg': errmsg },
			'username' : _user.username,
			'nickname' : _user.nickname
		}
		psession.set(req, _ps);
    	return res.redirect(vpath + '/mng/users/add');
  	}
  	_user.pwd = secure.hash(_user.pwd);
  	usersModel.create(_user, function(err, data) {
  		var _ps = {
  			'path' : vpath + '/mng/users',
  			'page_alert' : { 'msg': '新增成功' }
  		}
  		psession.set(req, _ps);
		res.redirect(vpath + '/mng/users');
  	});
}

/*
███╗   ███╗ ██████╗ ██████╗ ██╗███████╗██╗   ██╗
████╗ ████║██╔═══██╗██╔══██╗██║██╔════╝╚██╗ ██╔╝
██╔████╔██║██║   ██║██║  ██║██║█████╗   ╚████╔╝ 
██║╚██╔╝██║██║   ██║██║  ██║██║██╔══╝    ╚██╔╝  
██║ ╚═╝ ██║╚██████╔╝██████╔╝██║██║        ██║   
╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝        ╚═╝                                                  
*/

function modUserGet(req, res) {
	//網址亂打
	req.checkParams('id', 'Invalid id').isAlphanumeric();
	if (req.validationErrors())
		return onErrorRedirect();

	var _id = req.params.id;
	var _ps = psession.get(req);

	usersModel.getById(_id, function(err, data) {
		var _newps = {
			'path' : vpath + '/mng/users/' + _id,
			'_id' : _id,
		}
		psession.set(req, _newps);

		var _d = data[0];
		delete _d.pwd;
		_d.mode = 'mod';
		_d.page_alert = _ps.page_alert;
		_d.username = _ps.username || _d.username;
		_d.nickname = _ps.nickname || _d.nickname;
		_d.vpath = vpath;
		_d.page_title = '修改使用者資料';
		res.render('mng/users_add.html', _d);
	});
}
function modUserPost(req, res) {
	//網址亂打?
	req.checkParams('id', 'Invalid id').isAlphanumeric();
	if (req.validationErrors())
		return onErrorRedirect();
	var _id = req.params.id;
	var _ps = psession.get(req);
	//疑似不是從正常流程進入
	if (_ps._id != _id)
		return onErrorRedirect();

	var _user = { 'nickname' : req.body.nickname}

	req.checkBody('nickname', 'nickname空白').notEmpty();
	if (req.body.password) {
		req.checkBody('password', '無效的密碼').isPassword().isLength({min:6, max:20});
		_user.pwd = req.body.password;
	}

	var errors = req.validationErrors();
	if (errors) {
		var errmsg = '';
		for (var i= 0;i < errors.length; i++) {
			errmsg += errors[i].msg + '<br/>';
		}
		var _ps = {
			'path' : vpath + '/mng/users/'+ _id,
			'page_alert' : { 'msg' : errmsg },
			'username' : _user.username,
			'nickname' : _user.nickname,
			'vpath' : vpath,
			'page_title' : '修改使用者資料'
		}
		res.render('mng/users_add.html', _ps);
		delete _ps.alert_msg;
		psession.set(req, _ps);
    	//return res.redirect(vpath + '/mng/users/'+_id);
  	}
  	if (_user.pwd) _user.pwd = secure.hash(_user.pwd);
  	usersModel.updateData({'_id':_id}, _user, function(err, data) {
  		var _ps = {
  			'path' : vpath + '/mng/users',
  			'page_alert' : { 'msg': '修改成功' }
  		}
  		psession.set(req, _ps);
  		res.redirect(vpath + '/mng/users');
  	});
}

/*
███████╗██████╗ ██████╗  ██████╗ ██████╗ 
██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
█████╗  ██████╔╝██████╔╝██║   ██║██████╔╝
██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗
███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
*/
function onErrorRedirect(req, res) {
	res.redirect(vpath + '/mng/users');
}