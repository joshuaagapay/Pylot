var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RatingsSchema = new Schema({
    
    pilotseekerId:{type: Schema.Types.ObjectId, ref: 'User' },
    pilotplayerId:{type: Schema.Types.ObjectId, ref: 'User' },
    ratings: {type: Number},
    review: {type: String}
});

var Rating = mongoose.model('Rating', RatingsSchema);

module.exports = Rating;