var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose	= require("mongoose"),
	request = require('request'),
	io = require('socket.io');

mongoose.connect("mongodb://localhost/stellarglob");
app.set("view engine","ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	date: 	
	{
		type: Date,
		default: Date.now()
	}
});
var Blog = mongoose.model("Blog",blogSchema);

//GET ROUTE for the index.html
app.get("/",function(req,res){
	res.render("main");
});

//GET ROUTE for messenger service
app.get("/stellarMsg",function(req,res){
	res.render("messaginghome")
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
    

//GET ROUTE for stellarglob
app.get("/stellarglob",function(req,res){
	Blog.find({},function(err,allblogs){
		if (err){
			console.log(err);
		}else{
			res.render("index",{allblogs:allblogs});
		}
	});
});

//GET ROUTE for the new blog platform
app.get("/stellarglob/randompass",function(req,res){
	res.render("new");
});

app.get("/stellarglob/:id",function(req,res){
	Blog.findById(req.params.id, function(err,foundblog){
		if (err){
			res.redirect("/stellarglob");
		}
		else{
			res.render("show",{blog:foundblog});
		}
	});
});

app.post("/stellarglob",function(req,res){

	Blog.create(req.body.blog,function(err,blog){
		if (err){
			console.log(err);
		}else{
			res.redirect("/stellarglob");
		}
	});
});

app.listen(80,function(){
	console.log("Started");
});
