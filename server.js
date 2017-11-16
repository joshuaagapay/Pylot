var express        = require('express');
var app            = express();
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var router         = express.Router();
var appRoutes      = require('./app/routes/api')(router);
var path           = require('path');
var passport       = require('passport');
var socialFacebook = require('./app/passport/passport')(app, passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/pylot',  { useMongoClient: true }, function(err) {
    if(err) {console.log('cannot connect to mongdb' + err);
    }else{
        console.log('successfully connected to database');
    }
});


app.listen(process.env.PORT || 8080, function() {
    console.log('running server');
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

