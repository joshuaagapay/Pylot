var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RecommendSchema = new Schema({
    
    pilotseekerId:{type: Schema.Types.ObjectId, ref: 'User' },
    pilotplayerId:{type: Schema.Types.ObjectId, ref: 'User'},
    recommend_to:{type: Schema.Types.ObjectId, ref: 'User'},
    // gameId:{type: Schema.Types.ObjectId, ref: 'Game'},
    // game_details:{type: Schema.Types.ObjectId, ref: 'PilotedGame'},
    // date_accepted: {type: Date},
    // date_finish: {type: Date},
});

var Recommend = mongoose.model('Recommend', RecommendSchema);

module.exports = Recommend;