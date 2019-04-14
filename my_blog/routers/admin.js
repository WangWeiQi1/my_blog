var express = require('express');

var router = express.Router();

var User = require('../models/User');

var Category = require('../models/Category');

var Blog = require('../models/Blog');

var Essay = require('../models/Essay');

var Message = require('../models/Message');

var async = require('async');

var formidable = require('formidable');

var path = require('path');

var fs = require('fs');

var md5 = require('../utils/md5.js');

var responseData = {
	code: 0,
	message: ''
}

//查找所有用户
router.get('/allUsers',(req,res,next) => {
	var page = Number(req.query.page || 1);
	var limit = 5;
	User.count().then((count) => {
		pages = Math.ceil(count / limit);
		var skip = (page - 1) * limit;
		User.find().limit(limit).skip(skip).then((users) => {
			if(!users){
				responseData.code = -1;
				responseData.message = '暂无注册用户';
				res.json(responseData);
				return;
			}
			var result = {
				 code: 0,
				 message: '获取用户列表成功',
				 users: users,
				 count: count,
				 limit: limit,
				 pages: pages
			}
			res.json(result);
		})
	})	
})

//删除选中用户
router.get('/deleteUser',(req,res,next) => {
	var id = req.query.id || '';
	User.remove({
		_id: id
	}).then(() => {
		responseData.code = 0;
		responseData.message = '删除成功';
		res.json(responseData);
	});
})

//管理员添加用户
router.post('/addUsers',(req,res,next) => {
	var username = req.body.username;
	var password = req.body.password;
	var isAdmin = req.body.isAdmin;
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
			isAdmin: isAdmin,
			addTime: addTime,
			avatar: '默认.jpg'
		})
		user.save().then((success) => {
			responseData.code = 0;
			responseData.message = '添加成功';
			res.json(responseData);
		});
	})
})

//分类的添加
router.post('/addCategory',(req,res,next) => {
	var cateName = req.body.cateName || '';
	var addTime = req.body.addTime || '';
	Category.findOne({
		name: cateName
	}).then((rs) => {
		if(rs){
			responseData.code = -1;
			responseData.message = '分类已经存在';
			res.json(responseData);
			return;
		}else{
			return new Category({
				name: cateName,
				addTime: addTime
			}).save();
		}
	}).then((newCategory) => {
		responseData.code = 0;
		responseData.message = '分类添加成功';
		res.json(responseData);
	})
})

//分页获取所有分类
router.get('/allCategories',(req,res,next) => {
	var page = Number(req.query.page || 1);
	var limit = 5;
	Category.count().then((count) => {
		pages = Math.ceil(count / limit);
		var skip = (page - 1) * limit;
		Category.find().sort({_id: -1}).limit(limit).skip(skip).then((categories) => {
			if(!categories){
				responseData.code = -1;
				responseData.message = '暂无分类';
				res.json(responseData);
				return;
			}
			var result = {
				 code: 0,
				 message: '获取所有分类成功',
				 categories: categories,
				 count: count,
				 limit: limit,
				 pages: pages
			}
			res.json(result);
		})
	})	
})

//获取所有分类
router.get('/categories',(req,res,next) => {
	Category.find().then((categories) => {
		var result = {
			code: 0,
			message: '获取所有分类成功',
			categories: categories
		}
		res.json(result);

		// for循环嵌套异步的实现方式
		// async.map(categories,(category,callback) => {
		// 	var where = {};
		// 	where.category = category._id;
		// 	Blog.where(where).count().then((countx) => {
		// 	    var arr = '';
		// 	    arr += countx;
		// 		callback(null,arr);
		// 	})
		// },(err,results) => {
		// 	var result = {
		// 		code: 0,
		// 		message: '获取所有分类成功',
		// 		categories: categories,
		// 		arr: results
		// 	}
		// 	res.json(result);
		// })
	})
})

//删除分类
router.get('/deleteCate',(req,res,next) => {
	var id = req.query.id || '';
	Category.remove({
		_id: id
	}).then(() => {
		responseData.code = 0;
		responseData.message = '成功删除该分类';
		res.json(responseData);
	});
})

//修改分类
router.post('/editCategory',(req,res,next) => {
	var id = req.body.id || '';
	var name = req.body.name || '';
	var addTime = req.body.addTime || '';
	Category.findOne({
		name: name
	}).then((category) => {
		if(category){
			responseData.code = -1;
			responseData.message = '该分类已经存在';
			res.json(responseData);
			return;
		}else{
			return Category.update({
				_id: id
			},{
				name: name,
				addTime: addTime
			})
		}
	}).then((newCategory) => {
		responseData.code = 0;
		responseData.message = '分类修改成功';
		res.json(responseData);
	})
})

//发表文章
router.post('/addBlog',(req,res,next) => {
	var form = new formidable.IncomingForm();
 	form.uploadDir = path.normalize(__dirname + '/../cover');
    form.parse(req, function(err, fields, files) {
    	var oldpath = files.file.path;
    	var ArtTitle = fields.title;
    	var content = fields.content;
    	var categorys = fields.category;
    	var addTime = fields.addTime;
    	var description = fields.description;
    	var blogType = fields.blogType;
    	var user = req.session.userId.toString();
    	var imgName = files.file.name || 'defaultCover.jpg';
    	var coverImgName;
    	if(imgName == 'defaultCover.jpg'){
    		coverImgName = 'defaultCover.jpg';
    	}else{
    		coverImgName = imgName.replace(/[^.]+/,ArtTitle);
    	}
    	var newpath = path.normalize(__dirname + '/../cover') + '/' + coverImgName;
    	fs.rename(oldpath,newpath,(err) => {
    		if(err){
    			responseData.code = -1;
    			responseData.message = '上传封面失败';
    			res.json(responseData);
    			return;
    		}
    		Category.findOne({
    			name: categorys
    		}).then((category) => {
    			new Blog({
    				title: ArtTitle,
    				content: content,
    				category: category._id,
    				addTime: addTime,
    				description: description,
    				blogType: blogType,
    				user: user,
    				coverImg: coverImgName
    			}).save().then((result) => {
    				responseData.code = 0;
					responseData.message = '发表成功';
					res.json(responseData);
    			})
    		}).catch(new Function());
    	})
    })
})

//删除一篇文章
router.get('/deleteArticle',(req,res,next) => {
	var id = req.query.id || '';
	Blog.remove({
		_id: id
	}).then((blog) => {
		responseData.code = 0;
		responseData.message = '删除成功';
		res.json(responseData);
	})
})

//编辑文章
router.post('/editBlog',(req,res,next) => {
	var form = new formidable.IncomingForm();
 	form.uploadDir = path.normalize(__dirname + '/../cover');
    form.parse(req, function(err, fields, files) {
    	var oldpath = files.file.path;
    	var ArtTitle = fields.title;
    	var id = fields.id;
    	var content = fields.content;
    	var categorys = fields.category;
    	var addTime = fields.addTime;
    	var description = fields.description;
    	var blogType = fields.blogType;
    	var user = req.session.userId.toString();
    	var imgName = files.file.name;
    	var coverImgName = imgName.replace(/[^.]+/,ArtTitle);
    	var newpath = path.normalize(__dirname + '/../cover') + '/' + coverImgName;
    	fs.rename(oldpath,newpath,(err) => {
    		if(err){
    			responseData.code = -1;
    			responseData.message = '更新封面失败';
    			res.json(responseData);
    			return;
    		}
    		Category.findOne({
    			name: categorys
    		}).then((category) => {
    			Blog.update({
					_id: id
				},{
					title: ArtTitle,
					content: content,
					category: category._id,
					addTime: addTime,
					user: user,
					coverImg: coverImgName,
					description: description,
					blogType: blogType
				}).then((newBlog) => {
					responseData.code = 0;
					responseData.message = '修改成功';
					res.json(responseData);
				})
    		}).catch(new Function());
    	})
    })
})

//筛选某一分类下的全部文章(包含获取全部文章)
router.get('/selectCate',(req,res,next) => {
	var cateName = req.query.cateName || '';
	var page = Number(req.query.page || 1);
	var limit = 5;
	if(cateName == ''){
		Blog.count().then((count) => {
			pages = Math.ceil(count / limit);
			var skip = (page - 1) * limit;
			Blog.find().sort({isTop: -1}).limit(limit).skip(skip).populate(['category', 'user']).then((blogs) => {
				if(!blogs){
					responseData.code = -1;
					responseData.message = '还没有人发表过文章';
					res.json(responseData);
					return;
				}
				var result = {
					code: 0,
					message: '成功获取所有文章',
					blogs: blogs,
					count: count,
					limit: limit,
					pages: pages
				}
				res.json(result);
				return;
			})
		})
	}else{
		Category.findOne({
			name: cateName
		}).then((category) => {
			var where = {};
			where.category = category._id;
			Blog.where(where).count().then((count) => {
				pages = Math.ceil(count / limit);
				var skip = (page - 1) * limit;
				Blog.where(where).find().sort({addTime: -1}).limit(limit).skip(skip).populate(['category','user']).then((blogs) => {
					if(!blogs){
						responseData.code = -1;
						responseData.message = '该分类下还没有文章';
						res.json(responseData);
						return;
					}
					var result = {
						code: 0,
						message: '筛选成功',
						blogs: blogs,
						count: count,
						limit: limit,
						pages: pages
					}
					res.json(result);
				})
			})
		})
	}
})

//文章置顶
router.post('/zhiDing',(req,res,next) => {
	var id = req.body.id;
	// var addTime = req.body.addTime;
	// var isTop = req.body.isTop;
	Blog.update({
		_id: id
	},{
		// addTime: addTime,
		isTop: true
	}).then((newBlog) => {
		responseData.code = 0;
		responseData.message = '置顶成功';
		res.json(responseData);
	})
})

//取消文章置顶
router.post('/cancelZhiDing', (req,res,net) => {
	var id = req.body.id;
	Blog.update({
		_id: id
	}, {
		isTop: false
	}).then((newBlog) => {
		responseData.code = 0;
		responseData.message = '取消置顶成功';
		res.json(responseData);
	})
})

//发表一篇随笔
router.post('/addEssay',(req,res,next) => {
	var userId = req.session.userId.toString();
	var addTime = req.body.addTime;
	var content = req.body.content;
	User.findOne({
		_id: userId
	}).then((user) => {
		new Essay({
			addTime: addTime,
			user: userId,
			content: content
		}).save((newEssay) => {
			var result = {
				code: 0,
				message: '发表成功'
			}
			res.json(result);
		})
	})
})

//获取所有随笔
router.get('/allEssays',(req,res,next) => {
	var page = req.query.page || '';
	if(page == ''){
		Essay.find().sort({addTime: -1}).populate('user').then((essays) => {
			var result = {
				code: 0,
				message: '获取所有随笔成功',
				essays: essays
			}
			res.json(result);
			return;
		})
	}else{
		Essay.count().then((count) => {
			var limit = 5;
			var skip = (page - 1) * limit;
			Essay.find().sort({addTime: -1}).limit(limit).skip(skip).populate('user').then((essays) => {
				var result = {
					code: 0,
					message: '获取所有随笔成功',
					essays: essays,
					count: count,
					limit: limit
				}
				res.json(result);
				return;
			})
		})
	}
})

//删除一条随笔
router.get('/delEssay',(req,res,next) => {
	var id = req.query.id;
	Essay.remove({
		_id: id
	}).then((result) => {
		responseData.code = 0;
		responseData.message = '删除成功';
		res.json(responseData);
	})
})

//删除一条留言
router.get('/delMessage',(req,res,next) => {
	var id = req.query.id;
	Message.remove({
		_id: id
	}).then((result) => {
		responseData.code = 0;
		responseData.message = '删除成功';
		res.json(responseData);
	})
})

module.exports = router;