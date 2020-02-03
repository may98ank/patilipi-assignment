var PORT 		= 8080;

var express			= require("express"),
	mongoose		= require('mongoose'),
	User 			= require('./models/user'),
 	passport		= require('passport'),
 	bodyparser  	= require("body-parser"),
 	localPassport 	= require('passport-local');
 	

var app = express();

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
                res.redirect("/home");
            });
        }
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), (req, res)=>{
	res.send("Hello");
});

app.get('/login', (req, res)=>{
	res.render('login', {page:'login'});
});


app.get('/', (req, res)=>{
	res.render('landing');
});

app.get('/logout', (req, res)=>{
	req.logout();
	res.redirect('/');
});

app.listen(PORT, process.env.IP, ()=>{
	console.log("Assignment App");
});