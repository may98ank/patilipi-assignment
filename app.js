var PORT 		= 8080;

var express			= require("express"),
	mongoose		= require('mongoose'),
	User 			= require('./models/user'),
 	passport		= require('passport'),
 	bodyparser  	= require("body-parser"),
 	localPassport 	= require('passport-local'),
 	companyDB		= require('./models/company'),
 	employDB		= require('./models/employ');
 	

var app = express();

function seed() {
	User.remove({}, (err)=>{});
	companyDB.remove({}, (err)=>{});
	companyDB.create({
		name: "Pratilipi",
		image: "https://pbs.twimg.com/profile_images/808593472194105345/4kvzqx1Q_400x400.jpg",
		address: "3rd Floor, No. 627/628, 5th Cross, 15th Main, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
	});
}

	

mongoose.connect('mongodb://localhost:27017/company_employ', { useUnifiedTopology: true , useNewUrlParser: true});


app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({extended:true}));

app.use(require("express-session")({
	secret: "Hello World I'm a Programmer",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ++++++++++
//	Routes
// ++++++++++

var isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

app.get('/', (req, res)=>{
	res.render('landing');
});


app.get('/home', isLoggedIn, (req, res)=>{
	res.send("Home");
});


app.get('/register', (req, res)=>{
	res.render('register', {page:'register'});
});


app.post('/register', (req, res)=>{
	var newUser = new User({username:req.body.username});

    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, ()=>{
            	console.log(user);
            	var employ = {
            		userId: user._id,
            		image: req.body.image,
            		company: req.body.company,
            		role: req.body.role
            	};
            	employDB.create(employ, (err, createdemploy)=>{
            		res.redirect("/home");
            	});
            });
        }
    });
});


app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
}), (req, res)=>{
});

app.get('/login', (req, res)=>{
	res.render('login', {page:'login'});
});

app.get('/logout', isLoggedIn,(req, res)=>{
	req.logout();
	res.redirect('/');
});

app.listen(PORT, process.env.IP, ()=>{
	seed();
	console.log("Assignment App");
});