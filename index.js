var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose	= require("mongoose");

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

// Blog.create({
// 	title: "test",
// 	image: "https://www.ecampusnews.com/files/2016/01/blogs.jpg",
// 	body: "hello world!"

// },function(err,blog){
// 	if (err){
// 		console.log(err);
// 	}else{
// 		console.log(blog);
// 	}
// });

app.get("/",function(req,res){
	res.render("new");
});

app.get("/stellarglob",function(req,res){
	Blog.find({},function(err,allblogs){
		if (err){
			console.log(err);
		}else{
			res.render("index",{allblogs:allblogs});
		}
	});
});

app.get("/stellarglob/new",function(req,res){
	res.render("new");
});

app.get("/stellarglob/:id",function(req,res){
	res.render("new");
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

var port = process.env.PORT || 8000;
app.listen(80,function(){
	console.log("Started");
});
