var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MyGameServiceSchema = new Schema({
    
    userId:{type: Schema.Types.ObjectId, ref: 'User' },
    gameId:{type: Schema.Types.ObjectId, ref: 'Game'},
    game_level: {type: Number},
    years_experience:{type: Number},
    service_fee:{type: Number}
});

var MyGameService = mongoose.model('MyGameService', MyGameServiceSchema);

module.exports = MyGameService;