// BASE SETUP ================================================================
let express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	firebase = require("firebase");

let port = process.env.PORT || 8050; 


// firebase setup
firebase.initializeApp({
	apiKey: "AIzaSyCsrIPQcvpO6A6jv_f05Uo5JdFrEbfbW5c",
    authDomain: "postit-3a6ba.firebaseapp.com",
    databaseURL: "https://postit-3a6ba.firebaseio.com",
    projectId: "postit-3a6ba",
    storageBucket: "postit-3a6ba.appspot.com",
    messagingSenderId: "899725378622"
});

let db = firebase.database();
let usersRef = db.ref("users");
let signinRef = db.ref("signins");
let groupsRef = db.ref("groups");

// CONFIGURE APP

// body parser, to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// configure app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POSTS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, \
		content-type, Authorization');
	next();
});


// BASE APP ==================================================================
// MIDDLEWARE 


// BASE ROUTES 
app.get('/', function(req, res) {
	res.send('welcome to the home page!');
});



// API =======================================================================
let appRouter = express.Router();  // get an express router

// API MIDDLEWARE============================================================
appRouter.use(function(req, res, next) {
	console.log("someone just came to the app");
	// this is where we authenticate users
	next();
});

// API Routes =================================================================
appRouter.get('/', function(req, res) {
	res.json({ message: 'woah check out this json'});
});

appRouter.route('/users')
	//Singup or create a user
	.post(function(req, res) {
		// Firebase
		let user = {};
		user.username = req.body.username;
		user.password =req.body.password;
		user.email = req.body.email;
		
		usersRef.push({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
		}, 
		function(err) {
			if (err) {
				res.send(err)
			} else {
				res.json({ message: "Success: User created."})
			}
		});
	})

appRouter.route('/users/signin')
	//logins
	.post(function(req, res) {
		// Firebase
		let email = req.body.email;
		let password = req.body.password;

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
   console.log(error.code);
   console.log(error.message);
  
});
	
	})

appRouter.route('/groups')
	//Singup or create a user
		.post(function(req, res) {
		// Firebase
		let group = {};
		group.groupname = req.body.groupname;
		group.description = req.body.description;

		groupsRef.push({
		groupname: req.body.groupname,
		description: req.body.description,
		}, 
		function(err) {
			if (err) {
				res.send(err)
			} else {
				res.json({ message: "Success: group created."})
			}
		});
	})


// Register our routes - all routes prefixed with /api
app.use('/app', appRouter);


//START THE SERVER ===========================================================
app.listen(port);
console.log('port: '+ port);
