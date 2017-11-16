var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String},
    email: {type: String, unique: true},
    age: {type: Number},
    address: {type: String},
    usertype: {type: String, default: 'user'},
    status: {type: String, default: 'Active'},
    img: {type: String}
    
});

var User = mongoose.model('User', UserSchema);

module.exports = User;