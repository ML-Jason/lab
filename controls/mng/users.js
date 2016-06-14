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

	app.all(vpath + '/mng/users/me', function(req, res) {
		var _id = req.session._u._id;
		res.redirect(vpath + '/mng/users/'+_id);
	});
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
  			'page_alert' : { 'text': '刪除成功', 'type':'success' }
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
  			'page_alert' : { 'text': '刪除成功', 'type':'success' }
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
		'email' : '', 'nickname' : '', 'role': '', 'mode' : 'add'
	}
	var _ps = psession.get(req);
	_data.email = _ps.email || '';
	_data.nickname = _ps.nickname || '';
	_data.page_alert = _ps.page_alert || {};
	_data.vpath = vpath;
	_data.page_title = '新增使用者';
	
	res.render('mng/users_add.html', _data);
}
function addUserPost(req, res) {
	var _user = {
		'email' : req.body.email,
		'nickname' : req.body.nickname,
		'role' : req.body.role
	}

	req.checkBody('email', '無效的Email').isEmail().isMedialandEmail();
	req.checkBody('nickname', 'NickName為必填').notEmpty();
	req.checkBody('role', '權限為必填').notEmpty();

	var errors = req.validationErrors();
	var _ps = {};
	if (errors) {
		var errmsg = '';
		var errprop = '';
		for (var i= 0;i < errors.length; i++) {
			if (i !=0) {
				errprop += ',';
				errmsg += '\n';
			}
			errprop += errors[i].param;
			errmsg += errors[i].msg;
		}
		_ps = {
			'path' : vpath + '/mng/users/add',
			'page_alert' : { 'text': errmsg , 'errprop':errprop},
			'email' : _user.email,
			'nickname' : _user.nickname,
			'role' : _user.role
		}
		psession.set(req, _ps);
    return res.redirect(vpath + '/mng/users/add');
  }
  usersModel.findOne({'email':_user.email}, '_id', function(err, data) {
  	if (! err) {
  		if(data) {
  			_ps = {
					'path' : vpath + '/mng/users/add',
					'page_alert' : { 'text': '這個Email已經存在了!' },
					'email' : _user.email,
					'nickname' : _user.nickname,
					'role' : _user.role
				}
				psession.set(req, _ps);
    		return res.redirect(vpath + '/mng/users/add');
  		}
  		usersModel.create(_user, function(err, data) {
  			_ps = {
		  		'path' : vpath + '/mng/users',
		  		'page_alert' : { 'text': '新增成功', 'type':'success' }
		  	}
		  	psession.set(req, _ps);
				return res.redirect(vpath + '/mng/users');
		  });
  	} else {
	  	_ps = {
				'path' : vpath + '/mng/users/add',
				'page_alert' : { 'text': JSON.stringify(err) },
				'email' : _user.email,
				'nickname' : _user.nickname,
				'role' : _user.role
			}
	  	psession.set(req, _ps);
			return res.redirect(vpath + '/mng/users');
		}
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
		_d.email = _ps.email || _d.email;
		_d.nickname = _ps.nickname || _d.nickname;
		_d.role = _ps.role || _d.role;
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

	var _user = {
		'nickname' : req.body.nickname,
		'role' : req.body.role
	}

	req.checkBody('nickname', 'NickName為必填').notEmpty();
	req.checkBody('role', '權限為必填').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		var errmsg = '';
		for (var i= 0;i < errors.length; i++) {
			errmsg += errors[i].msg + '<br/>';
		}
		var _ps = {
			'path' : vpath + '/mng/users/'+ _id,
			'page_alert' : { 'text' : errmsg },
			'email' : _user.email,
			'nickname' : _user.nickname,
			'role' : _role,
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
  			'page_alert' : { 'text': '修改成功', 'type':'success' }
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