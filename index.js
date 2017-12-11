//********************************************************
// All imported variables
//********************************************************

var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose	= require("mongoose"),
	request = require('request'),
	http = require('http').Server(app)
	io = require('socket.io')(http),
	passport = require('passport'),
	Strategy = require('passport-facebook').Strategy;

//********************************************************
// messenger service -> stellarMsg
//********************************************************


var username;
var colorname;
var arr = ["primary","secondary","success","info","light"];

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://www.sumitsarin.com/stellarMsg'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook')
  );

app.get('/stellarMsg',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
  	username = req.user.displayName;
  	colorname = arr[Math.floor(Math.random()*arr.length)];
  	console.log(req.user);
  	res.render("messaginghome",{ user: req.user });
  });

io.on('connection', function(socket){
  socket.on('chat message', function(msg,from,colorpick){
  	from = username;
  	colorpick = colorname;
    io.emit('chat message', msg, from, colorpick);
  });
  socket.on('disconnect', function(){
    io.emit('chat message', String(username) + ' has disconnected');
  });
});

//********************************************************
// blogging service -> stellarglob
//********************************************************

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

//********************************************************
// Listening port (80)
//********************************************************

http.listen(80,function(){
	console.log("Started");
});
