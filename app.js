//1.引入express框架模块
var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser') //解析POST请求数据
const { log } = require('console')


//2.创建框架核心app对象
var app = express()


//3.配置框架
app.use('/public', express.static('public'))
app.engine('html', require('express-art-template'))
app.use(bodyParser.json()); //解析JSON格式数据（application/json）     解析后放到req对象的body属性中
app.use(bodyParser.urlencoded({ extended: false })); //解析文本格式数据（application/x-www-form-urlencoded）


//4.路由
// var indexRouter = require('./routes/index');
// var orderRouter = require('./routes/order');
	var stuRouter = require('./routes/stu');
// app.use('/',	     indexRouter);
// app.use('/order', orderRouter);
   app.use('/stu', stuRouter);


//5.启动服务
app.listen(8080, function(){
	console.log('http://localhost:8080')
})