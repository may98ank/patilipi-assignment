var PORT 		= 8080;

var express			= require("express"),
	mongoose		= require('mongoose'),
	User 			= require('./models/user'),
 	passport		= require('passport'),
 	bodyparser  	= require("body-parser"),
 	localPassport 	= require('passport-local');
 	

var app = express();

app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/company_employ', { useUnifiedTopology: true , useNewUrlParser: true});



app.get('/register', (req, res)=>{
	res.render('register', {page:'register'});
});

app.get('/login', (req, res)=>{
	res.render('login', {page:'login'});
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), (req, res)=>{
});


app.get('/', (req, res)=>{
	res.render('landing');
});

app.listen(PORT, process.env.IP, ()=>{
	console.log("Assignment App");
});