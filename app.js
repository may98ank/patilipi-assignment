let PORT = 8080;

let express = require("express");
let mongoose = require('mongoose');

let app = express();
app.set("view engine", 'ejs');

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useUnifiedTopology: true });

app.get('/login', (req, res)=>{
	res.render('login');
});


app.get('/', (req, res)=>{
	res.render('landing');
});

app.listen(PORT, process.env.IP, ()=>{
	console.log("Assignment App");
});