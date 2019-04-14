var express = require('express');

var app = express();

var mongoose = require('mongoose');

var cors = require('cors');

var session = require('express-session');

app.use("/avatar",express.static("./avatar"));

app.use("/cover",express.static("./cover"));

app.use("/link",express.static("./link"));

app.use("/emojis",express.static("./emojis"));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

var bodyParser = require('body-parser');

//bodyParser设置
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
	origin: ['http://localhost:8080'],
	methods: ['GET','POST'],
	allowHeaders: ['Content-Type','Authorization'],
	credentials: true
}))

app.use('/',require('./routers/main'));

app.use('/api',require('./routers/api'));

app.use('/admin',require('./routers/admin'));

mongoose.connect('mongodb://localhost:27017/my_blog',(err) => {
	if(err){
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功');
		app.listen(3000);
	}
})

