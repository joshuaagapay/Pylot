var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ComplaintsSchema = new Schema({
    
    pilotseekerId:{type: Schema.Types.ObjectId, ref: 'User' },
    pilotplayerId:{type: Schema.Types.ObjectId, ref: 'User' },
    complaints: {type: String},
    date_complaints: {type: Date, default: Date.now}
});

var Complaint = mongoose.model('Complaint', ComplaintsSchema);

module.exports = Complaint;