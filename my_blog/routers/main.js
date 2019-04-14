var express = require('express');

var router = express.Router();

var User = require('../models/User');

var Category = require('../models/Category');

var Blog = require('../models/Blog');

var Message = require('../models/Message');

var Link = require('../models/Link');

var formidable = require('formidable');

var path = require('path');

var fs = require('fs');

var responseData = {
	code: 0,
	message: ''
}

//index页面
router.get('/index',(req,res,index) => {
	responseData.login = req.session.login;
	responseData.username = req.session.username;
	responseData.isAdmin = req.session.isAdmin;
	responseData.code = 0;
	responseData.message = '获取文章列表成功';
	res.json(responseData);
})

//获取文章详情
router.get('/getDetail',(req,res,next) => {
	var id = req.query.id;
	Blog.findOne({
		_id: id
	}).populate(['user','category']).then((blog) => {
		blog.views ++;
		blog.save();
		Blog.where("addTime").lt(blog.addTime).sort({"addTime": -1}).limit(1).then((nextBlog) => {
			Blog.where("addTime").gt(blog.addTime).then((prevBlogs) => {
				var prevBlog = prevBlogs.slice(prevBlogs.length - 1);
				var result = {
					code: 0,
					message: '读取成功',
					blog: blog,
					prevBlog: prevBlog,
					nextBlog: nextBlog
				}
				res.json(result);
			})
		})
	})
})

//发表评论
router.post('/sendComments',(req,res,next) => {
	var id = req.body.id;
	var contents = req.body.content;
	var userId = req.session.userId.toString();
	var addTime = req.body.addTime;
	var blogId = req.body.blogId;
	User.findOne({
		_id: userId
	}).then((user) => {
		Blog.findOne({
			_id: blogId
		}).then((blog) => {
			let obj = {
				id: id,
				commentCon: contents,
				UserName: user.username,
				commentTime: addTime,
				UserAvatar: user.avatar,
				replies: []
			}
			blog.comments.push(obj);
			Blog.update({
				_id: blogId
			},{
				comments: blog.comments
			}).then((newPingLun) => {
				responseData.code = 0;
				responseData.message = '评论成功';
				res.json(responseData);
			})
		})
	})
})

//回复评论
router.post('/sendReplies',(req,res,next) => {
	var commentId = req.body.id;
	var userId = req.session.userId.toString();
	var contents = req.body.content;
	var addTime = req.body.addTime;
	var blogId = req.body.blogId;
	var toUser = req.body.toUser;
	User.findOne({
		_id: userId
	}).then((user) => {
		Blog.findOne({
			_id: blogId
		}).then((blog) => {
			let obj = {
				fromName: user.username,
				avatar: user.avatar,
				toName: toUser,
				addTime: addTime,
				content: contents
			}
			for(var i=0;i<blog.comments.length;i++){
				if(commentId == blog.comments[i].id){
					blog.comments[i].replies.push(obj);
				}
			}
			Blog.update({
				_id: blogId
			},{
				comments: blog.comments
			}).then((newReply) => {
				responseData.code = 0;
				responseData.message = '回复成功';
				res.json(responseData);
			})
		})		
	})
})

//获取该篇文章下的所有评论
router.get('/getComments',(req,res,next) => {
	var blogId = req.query.id;
	Blog.findOne({
		_id: blogId
	}).then((blog) => {
		var result = {
			code: 0,
			message: '获取成功',
			comments: blog.comments
		}
		res.json(result);
	})
})

//获取热门文章列表
router.get('/getHotArticles',(req,res,next) => {
	var limit = 6;
	Blog.find().sort({views: -1}).limit(limit).then((blogs) => {
		var result = {
			code: 0,
			message: '获取热门文章列表成功',
			blogs: blogs
		}
		res.json(result);
	})
})

//获取置顶文章列表
router.get('/getTopArticles',(req,res,next) => {
	var where = {};
	var limit = 6;
	where.isTop = true;
	Blog.where(where).sort({views: -1}).limit(limit).then((blogs) => {
		var result = {
			code: 0,
			message: '获取置顶列表成功',
			blogs: blogs
		}
		res.json(result);
	})
})

//提交留言
router.post('/sendMessage',(req,res,next) => {
	var user = req.session.userId.toString();
	var content = req.body.content;
	var addTime = req.body.addTime;
	new Message({
		user: user,
		content: content,
		addTime: addTime
	}).save((newMessage) => {
		var result = {
			code: 0,
			message: '成功提交留言'
		}
		res.json(result);
	})
})

//获取所有留言
router.get('/allMessages',(req,res,next) => {
	var page = req.query.page || 1;
	Message.count().then((count) => {
		var limit = 5;
		var skip = (page - 1) * limit;
		Message.find().sort({addTime: -1}).limit(limit).skip(skip).populate('user').then((messages) => {
			var result = {
				code: 0,
				message: '成功获取所有留言',
				count: count,
				messages: messages,
				limit: limit
			}
			res.json(result);
		})
	})
})

//回复留言
router.post('/replayMessage',(req,res,next) => {
	//这条留言的id
	var messageId = req.body.messageId;
	//被回复的人的名字
	var toUserName = req.body.toUserName;
	//回复的内容
	var replyContent = req.body.replyContent;
	//回复的时间
	var replyTime = req.body.replyTime;
	//查找回复的人的名字
	var userId = req.session.userId.toString();
	User.findOne({
		_id: userId
	}).then((user) => {
		Message.findOne({
			_id: messageId
		}).populate('user').then((message) => {
			var obj = {
				msgId: message._id,
				fromName: user.username,
				toName: toUserName,
				replyContent: replyContent,
				replyTime: replyTime,
				replyAvatar: user.avatar
			}
			message.replies.push(obj);
			Message.update({
				_id: messageId
			},{
				replies: message.replies
			}).then((newMessage) => {
				var result = {
					code: 0,
					message: '回复成功'
				}
				res.json(result);
			})
		})
	})
})

//添加友链
router.post('/addLinks',(req,res,next) => {
	var form = new formidable.IncomingForm();
 	form.uploadDir = path.normalize(__dirname + '/../link');
    form.parse(req, function(err, fields, files) {
    	var oldpath = files.file.path;
    	var name = fields.name;
    	var desc = fields.desc;
    	var link = fields.link;
    	var imgName = files.file.name;
    	var xxxName = imgName.substr(imgName.length - 4,imgName.length);
    	var linkImgName = imgName.replace(/[^.]+/,name);
    	var newpath = path.normalize(__dirname + '/../link') + '/' + linkImgName;
    	fs.rename(oldpath,newpath,(err) => {
    		if(err){
    			responseData.code = -1;
    			responseData.message = '图标上传失败';
    			res.json(responseData);
    			return;
    		}
    		if(linkImgName == ('undefined' + xxxName)){
    			return;
    		}
    		new Link({
    			name: name,
    			desc: desc,
    			link: link,
    			logo: linkImgName
    		}).save().then((newLink) => {
    			responseData.code = 0;
    			responseData.message = '添加成功';
    			res.json(responseData);
    		}).catch(new Function())
    	})
    })
})

//获取全部友链
router.get('/getLinks',(req,res,next) => {
	Link.count().then((count) => {
		var page = req.query.page || 1;
		var limit = 5;
		var skip = (page - 1) * limit;
		Link.find().limit(limit).skip(skip).then((links) => {
			var result = {
				code: 0,
				message: '获取成功',
				links: links,
				count: count,
				limit: limit
			}
			res.json(result);
		})
	})
})

//删除一条友链
router.get('/delLinks',(req,res,next) => {
	var id = req.query.id;
	Link.remove({
		_id: id
	}).then((result) => {
		responseData.code = 0;
		responseData.message = '删除成功';
		res.json(responseData);
	})
})

//模糊查询
router.get('/searchLikeIt', (req,res,next) => {
	var search = req.query.search;
	const reg = new RegExp(search, 'i');
	Blog.find({
		$or: [
			{title: {$regex: reg}}
		]
	}).sort({addTime: -1}).then((blogs) => {
		responseData.code = 0;
		responseData.message = '查询成功';
		responseData.data = blogs;
		res.json(responseData);
	})
})


module.exports = router;