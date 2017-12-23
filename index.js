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
	Strategy = require('passport-facebook').Strategy
	cookieParser = require('cookie-parser');

//********************************************************
// notes service -> stellarNotes
//********************************************************

var serveIndex = require('serve-index');

app.use(express.static(__dirname + "/public/images"));
app.use('/stellarnotes', serveIndex(__dirname + '/public/images'));
app.use(express.static(__dirname + "/stellarnotes"));
app.use('/stellarnotes', serveIndex(__dirname + '/stellarnotes'));
app.use(express.static(__dirname + "/stellarnotes1"));
app.use('/stellarnotes1', serveIndex(__dirname + '/stellarnotes1'));
app.get("/stellarnotes/*.pdf",function(req,res){
	console.log(req.params[0]);
	res.render("stellarnote",{ note: req.params[0] });
});

//********************************************************
// messenger service -> stellarMsg
//********************************************************


var username; //name of user obtained
var colorname; //color of the message blobs for one user
var arr = ["primary","secondary","success","info","light"]; //array for storing color buttons
var numusers = -1;
var usersList = []
var thisuser

//Some passport interface requirements
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

//GET Route for /login
app.get('/login',
  function(req, res){
    res.render('login');
  });

//GET Route for /login/facebook
app.get('/login/facebook',
  passport.authenticate('facebook')
  );

//GET Route for /stellarMsg
app.get('/stellarMsg',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
  	usersList.push(req.user.displayName);
  	thisuser = req.user.displayName;
  	console.log(req.user);
  	res.render("messaginghome",{ user: req.user });
  });

// Socket.io connection(old)
// io.on('connection', function(socket){
//   io.emit('chat message', ' has connected', String(username), 'danger', {username: socket.username});
//   socket.on('chat message', function(msg,from,colorpick){
//   	from = usersList[thisuser];
//   	colorpick = colorname;
//     io.emit('chat message', msg, from, colorpick);
//   });
//   socket.on('disconnect', function(){
//     io.emit('chat message', ' has disconnected', String(username), 'danger');
//   });
// });

//Socket.io connection
io.on('connection', function(socket){
  socket.username = String(thisuser);
  io.emit('chat message', {
  	username: socket.username,
  	message: "has connected"
  });
  
  socket.on('chat message', function(data){
    
    io.emit('chat message', {
    	username: socket.username,
    	message: data
    });

  });
  
  socket.on('disconnect', function(){
    io.emit('chat message', {
    	username: socket.username,
    	message: "has disconnected"
    });
  });

});

//********************************************************
// blogging service -> stellarglob
//********************************************************

mongoose.connect("mongodb://localhost/stellarglob");
app.set("view engine","ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

//blogschema is the basic schema for every blog entry
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
