var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MyGameSchema = new Schema({
    
    userId:{type: Schema.Types.ObjectId, ref: 'User' },
    gameId:{type: Schema.Types.ObjectId, ref: 'Game'},
    game_level: {type: Number},
    years_experience:{type: Number},
});

var MyGame = mongoose.model('Mygame', MyGameSchema);

module.exports = MyGame;