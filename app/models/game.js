var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GameSchema = new Schema({
    gamename: {type: String},
    img: {type: String},
    min_fee: {type: Number},
    max_fee: {type: Number},
    min_level: {type: Number},
    max_level: {type: Number},
    year_created: {type: Number},
    year_today: {type: Number}
});

var Game = mongoose.model('Game', GameSchema);

module.exports = Game;