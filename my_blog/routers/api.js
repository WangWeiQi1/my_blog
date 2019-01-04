var express = require('express');

var router = express.Router();

var User = require('../models/User');

var md5 = require('../utils/md5.js');

var formidable = require('formidable');

var path = require('path');

var fs = require('fs');

var responseData;

router.use((req,res,next) => {
	responseData = {
		code: 0,
		message: ''
	}
	next();
})

//用户注册
router.post('/reg',(req,res,next) => {
	var username = req.body.username;
	var password = req.body.password;
	var addTime = req.body.addTime;
	var password = md5(md5(password) + 'wang');
	User.findOne({
		username: username
	}).then((userInfo) => {
		if(userInfo){
			responseData.code = -1;
			responseData.message = '用户名已被占用';
			res.json(responseData);
			return;
		}
		var user = new User({
			username: username,
			password: password,
			addTime: addTime,
			avatar: '默认.jpg'
		})
		user.save().then((success) => {
			responseData.code = 0;
			responseData.message = '注册成功';
			req.session.login = 0;
			req.session.username = username;
			res.json(responseData);
			return;
		});
	})
})

//用户登录
router.post('/login',(req,res,next) => {
	var username = req.body.username;
	var password = req.body.password;
	var password = md5(md5(password) + 'wang');
	User.findOne({
		username: username
	}).then((userInfo) => {
		if(!userInfo){
			responseData.code = -1,
			responseData.message = '用户不存在,请先注册';
			res.json(responseData);
			return;
		}
		if(password != userInfo.password){
			responseData.code = -2;
			responseData.message = '请检查您的密码';
			res.json(responseData);
			return;
		}
		req.session.login = 1;
		req.session.username = username;
		req.session.isAdmin = userInfo.isAdmin;
		req.session.userId = userInfo._id;
		req.session.avatar = userInfo.avatar;
		var result = {
			code: 0,
			message: '登陆成功',
			username: req.session.username,
			login: req.session.login,
			isAdmin: req.session.isAdmin,
			userId: req.session.userId,
			avatar: req.session.avatar
		}
		res.json(result);
	})
})

//用户登出
router.get('/exit',(req,res,next) => {
	req.session.login = 0;
	req.session.username = '';
	req.session.isAdmin = false;
	responseData.code = 0;
	responseData.message = '退出成功';
	res.json(responseData);
})

//后台管理身份判断
router.get('/checkUser',(req,res,next) => {
	if(req.session.login != 1){
		responseData.code = -2;
		responseData.message = '您还没登录';
		res.json(responseData);
		return;
	}
	if(req.session.isAdmin == false){
		var result = {
			code: -1,
			message: '您不是管理员,没有权限进入后台',
			login: 0
		}
		res.json(result);
		return;
	}
	responseData.login = req.session.login;
	responseData.username = req.session.username;
	responseData.isAdmin = req.session.isAdmin;
	responseData.code = 0;
	responseData.message = '欢迎进入后台管理';
	res.json(responseData);
})


//上传头像
router.post('/uploadAvatar',(req,res,next) => {
	var form = new formidable.IncomingForm();
 	form.uploadDir = path.normalize(__dirname + '/../avatar');
    form.parse(req, function(err, fields, files) {
    	var oldpath = files.file.path;
    	var imgName = files.file.name;
    	var picName = req.session.username;
    	var userImgName = imgName.replace(/[^.]+/,picName);
    	var newpath = path.normalize(__dirname + '/../avatar') + '/' + userImgName;
    	fs.rename(oldpath,newpath,(err) => {
    		if(err){
    			responseData.code = -1;
    			responseData.message = '上传头像失败';
    			res.json(responseData);
    			return;
    		}
    		User.update({
    			username: req.session.username
    		},{
    			avatar: userImgName
    		}).then((newUserInfo) => {
    			var result = {
	    			code: 0,
	    			message: '上传成功',
	    			avatar: userImgName
	    		}
    			res.json(result);
    		})
    	})
    });
})


module.exports = router;