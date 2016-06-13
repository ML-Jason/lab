var mongoose = require('mongoose');
var async = require('async');

var userSchema = mongoose.Schema({
	email : { type : String, index : true},
	nickname : String,
	//pwd : String,
	role : String,
	//email : String,
	logindate : Number,
	createdate : { type: Date, default: Date.now }
});
var Users = mongoose.model('users', userSchema);
module.exports = Users;

//確認身份(登入)
Users.auth = function(obj, cb) {
	Users.find(obj).exec(cb);
}

//更新登入時間
Users.updateLogindate = function(obj, cb) {
	Users.update(obj, {$set: {logindate: Date.now()}}).exec(cb);
}
//更新使用者資料
Users.updateData = function(obj, newobj, cb) {
	if (newobj._id)
		delete newobj._id;
	Users.update(obj, { $set: newobj }).exec(cb);
}
//取得所有筆數
Users.getUsersCount = function(cb) {
	Users.count({}).exec(cb);
}
//取得列表
Users.getUsersList = function(page, pagesize, cb) {
	if (! page) page = 1;
	if (! pagesize) pagesize = 10;
	var rdata = {
		'totalcount':0,
		'totalpage':0,
		'page':page,
		'pagesize':pagesize,
		'next':'',
		'prev':'',
		'data':[]
	};
	//async.parallel([
	async.series([
    	function(callback) {
    		Users.getUsersCount(function(err, data) {
    			rdata.totalcount = data;
    			rdata.totalpage = Math.ceil(data/pagesize);
    			callback();
    		});
    	},
    	function(callback) {
    		if (rdata.totalpage < rdata.page) rdata.page = rdata.totalpage;
    		Users.find({}).select('_id email nickname role')
			.skip((rdata.page-1)*pagesize)
			.limit(pagesize)
			.sort({ 'createdate':-1 })
			.exec(function(err, data) {
				if (err) {
					console.log(err);
					return;
				}
				rdata.data = data;
				callback();
			});
    	}
	], function(err) {
		if (cb)
			cb(err, rdata);
	});
}
//建立使用者
Users.create = function(obj, cb) {
	if (!obj.createdate) obj.createdate = Date.now();
	obj.logindate = 0;
	var newuser = new Users(obj);
	//newuser.save().exec(cb);
	newuser.save(cb);
}
//刪除使用者
Users.delById = function(ids, cb) {
	Users.remove({'_id' : {'$in' : ids}}).exec(cb);
}
//用_id的方式搜尋
Users.getById = function(ids, cb) {
	Users.find({'_id' : {'$in' : ids}}).exec(cb);
};
