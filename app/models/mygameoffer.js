var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MyGameOfferSchema = new Schema({
    
    userId:{type: Schema.Types.ObjectId, ref: 'User' },
    gameId:{type: Schema.Types.ObjectId, ref: 'Game'},
    game_level: {type: Number},
    goal_level: {type: Number},
    years_experience:{type: Number},
});

var MyGameOffer = mongoose.model('MyGameOffer', MyGameOfferSchema);

module.exports = MyGameOffer;