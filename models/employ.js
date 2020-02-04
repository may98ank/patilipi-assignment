var mongoose = require('mongoose');

var EmploySchema = new mongoose.Schema({
    userId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: "User"
    },
    image: String,
    company: String,
    role: String
});

module.exports = mongoose.model('Employee', EmploySchema);