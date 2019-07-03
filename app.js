var express		 = require ("express"),
	app 		 = express(),
	bodyParser 	 = require("body-parser"),
	mongoose 	 = require("mongoose"),
	flash		 = require("connect-flash"),
	passport 	 = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride	= require("method-override"),
 	Campground 	 = require("./models/campground"),
	seedDB 		 = require("./seeds"),
	User 		 =require("./models/user"),
	Comment 	 = require("./models/comment");

//Requiring Routes
var commentsRoutes	 = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes		 = require("./routes/index");

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb+srv://Megan:tammie11@cluster0-gd2ra.mongodb.net/test?retryWrites=true&w=majority", 
				 { useNewUrlParser: true,
				 	useCreateIndex: true
				 }).then(() => {
					console.log("connected to DB");
					}). catch(err => 
					  {console.log("error", err.message); 
					});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify', false);

//seed the database//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once Again girls wins cutest dogs!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/campgrounds", campgroundRoutes);

var port = 3000 || process.env.PORT;
app.listen(port, function () {
console.log("The YelpCamp Server started!");
});
	