var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PilotedGameSchema = new Schema({
    
    pilotseekerId:{type: Schema.Types.ObjectId, ref: 'User' },
    pilotplayerId:{type: Schema.Types.ObjectId, ref: 'User'},
    gameId:{type: Schema.Types.ObjectId, ref: 'Game'},
    date_accepted: {type: Date},
    date_finish: {type: Date},
    pilotplayerFee:{type: Number},
    goal:{type: Number},
    game_level: {type: Number},
    level_gain: {type: Number, default: 0},
    level_milestone: {type: Number},

    status:{type: String, default: 'Pending'}
});

var PilotedGame = mongoose.model('PilotedGame', PilotedGameSchema);

module.exports = PilotedGame;