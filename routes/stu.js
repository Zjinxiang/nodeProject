var express = require('express')
var fs = require('fs')
var router = express.Router()

router.get('/', function(req, res){
	//学生列表
	//获取数据
	fs.readFile('./db.json', 'utf8', function(err, data){
		if (err) res.end('404 Not Find.');
		//数据过滤（字符串转化为数组）
		var stus = JSON.parse(data).stus
		//加载视图并传递数据
		res.render('index.html', {
			stus: stus
		})
	})
})
router.get('/create', function(req, res){
	//学生添加-视图 
	return res.render('post.html')
})
router.post('/create', function(req, res){
    var d = new Date();
    var date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+
               d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	//学生添加-数据处理
	//1.获取表单提交数据（req.body）
	var stu = req.body;
	//2.获取数据库db.json数据（组装）
	fs.readFile('./db.json', 'utf8', function (err, data) {
		if (err) res.end('404 Not Find.');
		//获取旧数据
		var stus = JSON.parse(data).stus
		console.log(stus.length)
	    //压入新数据 
	    stu.id = stus.length + 1

	    stu.create_at = date
	    stus.push(stu)
	    //转化为字符串
	    //3.入库
	    var fileData = JSON.stringify({stus: stus })
	    fs.writeFile('./db.json', fileData, function (err) {
	        if (err) res.end('404 Not Find.');
	        //跳转
		    res.redirect('/stu')
	    })
	})
})

//删除
router.get('/delete/:id', function(req, res){
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
router.get('/edit/:id', function(req, res){  //:id是指数字并不是字符串:id
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
router.post('/edit', function(req, res){
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

module.exports = router