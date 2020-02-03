var mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({
    name: String,
    logo: String,
    address: String,
    viewcount : Number
});

module.exports = mongoose.model('Company', CompanySchema);