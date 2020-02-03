var mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({
    name: {type: String, unique:true},
    image: String,
    address: String,
    viewcount : Number
});

module.exports = mongoose.model('Company', CompanySchema);