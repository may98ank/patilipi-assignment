var mongoose = require('mongoose');
var mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');


var CompanySchema = new mongoose.Schema({
    name: {type: String, unique:true},
    image: String,
    address: String,
    viewcount : {type:Number, default:0}
});

CompanySchema.plugin(mongoose_fuzzy_searching, {fields: ['name']});


module.exports = mongoose.model('Company', CompanySchema);