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
app.get('/stu', function(req, res){
	//学生列表
	//获取数据
	fs.readFile('./db.json', 'utf8', function(err, data){
		if (err) res.end('404 Not Find.');
		//数据过滤
		//从文件获取过来就是字符串
       //将字符转换为JSON对象，如：var str = '{name:"z3", age:18}'
		var stus = JSON.parse(data).stus 
		//console.log(data.stus)//脚下留心：从文件获取过来就是字符串
		//加载视图并传递数据
		res.render('index.html', {
			stus: stus
		})
	})
})

//添加
app.get('/stu/create', function(req, res){
	//学生添加-视图
	return res.render('post.html')
})
app.post('/stu/create', function(req, res){
	//学生添加页-数据处理
	//1.接受数据  { name: 'aaa', pwd: 'aaa', age: 'aaaa', sex: '女' }
	//console.log(req.body) { name: 'aaa', pwd: 'aaa', age: 'aaaa', sex: '女' }
	var stu = req.body
	//2.过滤（跳过）
	
	//3.获取数据库数据，然后压入新数据（注：因为是操作文件，所以增加复杂度，如果是数据库直接插入）
	fs.readFile('./db.json', 'utf8', function(err, data){
		if (err) res.send('Server Error.')

		//3.1获取旧数据（原因：避免写的时候覆盖）
		var stus = JSON.parse(data).stus
		//3.2组装数据
		var d = new Date();
		var date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+
		         d.getHours()+'-'+d.getMinutes()+'-'+d.getSeconds();
		stu.create_at = date;
		stu.id = stus[stus.length - 1].id + 1  //最后一个元素ID + 1 
		//3.3入库（压入新数据）
		stus.push(stu)
		//3.4写入文件中（注：不能直接写对象，需要先转化为字符串）
		var stusStr = JSON.stringify({stus: stus})
		fs.writeFile('./db.json', stusStr, function(err){
			if (err) res.send('Server Error.')
			//3.5跳转
			res.redirect('/stu')
		})
	})
})

//删除
app.get('/stu/delete/:id', function(req, res){
	//学生删除
	//1.获取地址栏数据
	var id = req.params.id;
	//2.操作数据库
	fs.readFile('./db.json', function (err, data) {
		if (err) res.end('404 Not Find.');
		//获取旧数据
		var stus = JSON.parse(data.toString()).stus
	    //删除数据，
	    //语法：数组.findIndex（回调函数）   根据条件找数据下标
	    //语法：数组.splice(起始下标, 个数)  从数组中删除数据
	    var deleteId = stus.findIndex(function (item) {
	    	return item.id == id
	    }) 
	    stus.splice(deleteId, 1)
	    //3.入库，转化为字符串
	    var fileData = JSON.stringify({stus: stus})
	    fs.writeFile('./db.json', fileData, function (err) {
	        if (err) res.end('404 Not Find.');
	        //跳转
		    res.redirect('/stu')
	    })
	})
})

//编辑
app.get('/stu/edit/:id', function(req, res){  //:id是指数字并不是字符串:id
	//学生修改-视图
	//获取参数
	var id = req.params.id;
	//获取数据
	fs.readFile('./db.json', 'utf8',function (err, data) {
		if (err) res.end('404 Not Find.');
		//数据过滤（字符串转化为数组）
		var stus = JSON.parse(data.toString()).stus
	    //语法：数组.findIndex（回调函数）   根据条件找数据
	    var stu = stus.find(function(item){
	    	return item.id == id
	    })
		console.log(stu);
		//加载视图并传递数据
		return res.render('edit.html', {
			stu: stu
		}) 
	})
})
app.post('/stu/edit', function(req, res){
    var d = new Date();
    var date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+
               d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	//学生添加-数据处理
	//1.获取表单提交数据（req.body）
	var stu = req.body;
	//2.获取数据库db.json数据（组装）
	fs.readFile('./db.json', function (err, data) {
		if (err) res.end('404 Not Find.');
		//获取旧数据
		var stus = JSON.parse(data.toString()).stus
	    //更新旧数据
	    var updateId = stus.findIndex(function (item) {
	    	return item.id == stu.id
	    }) 
	    stu.create_at = date;
	    stus[updateId] = stu
	    //3.入库（转化为字符串）
	    var fileData = JSON.stringify({stus: stus })
	    fs.writeFile('./db.json', fileData, function (err) {
	        if (err) res.end('404 Not Find.');
	        //跳转
		    res.redirect('/stu')
	    })
	})
})

//5.启动服务
app.listen(8080, function(){
	console.log('http://localhost:8080')
})