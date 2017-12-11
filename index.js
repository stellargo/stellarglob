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

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://www.sumitsarin.com/stellarMsg'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
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

// app.get('/stellarMsg',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.render('messaginghome');
//   });

// app.get("/stellarMsg",function(req,res){
// 	if (req.user){
// 		console.log("111");
// 		res.render("messaginghome");
// 	} else {
// 		console.log("222");
// 		res.redirect('/login');
// 	}
// });

app.get('/login',
  function(req, res){
  	console.log("333");
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook')
  );

app.get('/stellarMsg',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log(req.user);
  	res.render("messaginghome");
  });

// app.get('/login/facebook/return', 
//   passport.authenticate('facebook', { failureRedirect: '/logi' }),
//   function(req, res) {
//     res.redirect('/');
//   });

// app.get('/stellarMsg',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.render('messaginghome');
//   });

// app.get('/stellarMsg',
//   require('connect-ensure-login').ensureLoggedIn('/login'),
//   function(req, res) {
//     res.render('/stellarMsg');
//   });

// app.get('/stellarMsg',
//   passport.authenticate('facebook'));


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
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
