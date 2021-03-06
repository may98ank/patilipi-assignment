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

mongoose.connect('mongodb://localhost:27017/company_employ', { useUnifiedTopology: true , useNewUrlParser: true});



function seed() {
	// User.remove({}, (err)=>{});
	// employDB.remove({}, (err)=>{});
	var data = [
		{
			name: "Pratilipi",
			image: "https://pbs.twimg.com/profile_images/808593472194105345/4kvzqx1Q_400x400.jpg",
			address: "3rd Floor, No. 627/628, 5th Cross, 15th Main, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
		},
		{
			name: "Red chilli",
			image: "https://cdn.designcrowd.com/blog/2015/December/top-100-brands-logo-2015/6_500.png",
			address: "3rd Floor, No. 627/628, 5th Cross, 15th Main, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
		},
		{
			name: "Amazon chilli",
			image: "https://cdn.designcrowd.com/blog/2015/December/top-100-brands-logo-2015/4_500.png",
			address: "3rd Floor, No. 627/628, 5th Cross, 15th Main, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
		},
		{
			name: "Cramaoz",
			image: "https://cdn.designcrowd.com/blog/2015/December/top-100-brands-logo-2015/1_500.png",
			address: "3rd Floor, No. 627/628, 5th Cross, 15th Main, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
		},
		{
			name: "Tata lipi",
			image: "https://cdn.designcrowd.com/blog/2015/December/top-100-brands-logo-2015/3_500.png",
			address: "3rd Floor, No. 627/628, 5th Cross, 15th Main, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
		}
	];
	companyDB.remove({}, (err)=>{
		if(err){
			console.log('Could Not Delete Existing Companies');
		}else{
			companyDB.create(data);
		}
	});
}

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
  	
//   });
// });

	


app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({extended:true}));

app.use(require("express-session")({
	secret: "Hello World I'm a Programmer",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    // res.locals.loginerror = false;
    // res.locals.asklogin = false;
    // res.locals.userexist = false;
    next();
});



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
    req.session.asklogin = true;
    res.redirect('/login');
};

app.get('/', (req, res)=>{
	res.render('landing');
});


app.get('/home', isLoggedIn, (req, res)=>{
	employDB.findOne({userId: req.user._id}).populate('userId').exec((err, employee)=>{
		if(err || employee === null){
			res.send("Some Error Occured at Server 1");
		}else{
			// console.log(employee);
			res.render('home', {employee:employee});
		}
	});
});

app.get('/search', isLoggedIn, (req, res)=>{
	var query = req.query.query;
	companyDB.fuzzySearch(query, (err, results)=>{
		if(err){
			console.log(err);
		}else{
		}
		res.render('searchresult', {results: results});
	});
});

app.get('/company/:id', isLoggedIn, (req, res)=>{
	companyDB.findById(req.params.id, (err, companyInfo)=>{
		if(err){
			res.send('Some Error Occured at Server 3');
		}else{
			companyInfo.viewcount += 1;
			companyInfo.save();
			res.render('company', {company: companyInfo});
		}
	});
});

app.get('/register', (req, res)=>{
	let  error = false;
	if(typeof req.session.userexist !== 'undefined' && req.session.userexist === true){
		error = true;
		req.session.userexist = false;
	}
	res.render('register', {page:'register', usernametaken:error});
});


app.post('/register', (req, res)=>{
	var newUser = new User({username:req.body.username});

    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
        	req.session.userexist = true;
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, ()=>{
            	var employ = {
            		userId: user._id,
            		image: req.body.image,
            		company: req.body.company,
            		role: req.body.role
            	};
            	employDB.create(employ, (err, createdemploy)=>{
            		if(err){
            			// console.log(err);
            			res.send("Some Error Occured at Server 2");
            		}else{
            			// console.log(2);
            			res.redirect("/home");
            		}
            	});
            });
        }
    });
});

app.get('/loginfail', (req, res)=>{
	req.session.loginerror = true;
	res.redirect('/login');
});


app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/loginfail'
}), (req, res)=>{
});

app.get('/login', (req, res)=>{
	let error1 = false, error2 = false;
	if(typeof req.session.asklogin !== 'undefined' && req.session.asklogin === true){
		error1 = true;
		req.session.asklogin = false;
	}
	if(typeof req.session.loginerror !== 'undefined' && req.session.loginerror === true){
		error2 = true;
		req.session.loginerror = false;
	}
	console.log(req.session.loginerror);
	console.log(req.session.asklogin);
	res.render('login', {page:'login', askloginerror: error1, invaliderror: error2});
});

app.get('/logout', isLoggedIn,(req, res)=>{
	req.logout();
	res.redirect('/');
});

app.listen(process.env.PORT, process.env.IP, ()=>{
	seed();
	console.log("Assignment App");
});

// https://salty-dawn-52431.herokuapp.com/