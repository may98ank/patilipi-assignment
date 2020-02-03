var mongoose = require('mongoose');

var EmploySchema = new mongoose.Schema({
    user: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: "User"
    },
    image: String,
    company: String,
    role: String
});

module.exports = mongoose.model('Employee', EmploySchema);