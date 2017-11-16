var User          = require('../models/users.js');
var Game          = require('../models/game.js');
var MyGame        = require('../models/mygame.js');
var MyGameOffer   = require('../models/mygameoffer.js');
var PilotedGame   = require('../models/pilotedgame.js');
var MyGameService = require('../models/mygameservice.js');
var Recommend     = require('../models/recommend.js');
var Rating        = require('../models/ratings.js');
var Complaint     = require('../models/complaints.js');
var jwt           = require('jsonwebtoken');
var secret        = 'No-Girlfriend-Since-Birth';
var multer        = require('multer');
var storage       = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/app/assets/img');
    },
    filename: function(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null, Date.now() + '_' + file.originalname);
        }
    }
});
var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single('myfile');

module.exports = function(router) {
    
    router.post('/users', function(req,res) {
    res.send('testing routes');
    });
    
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['token'];
   
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token Expired' });
                } else {
                    req.decoded = decoded;
                    next(); 
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });
    
    router.post('/me', function(req, res) {
        res.send(req.decoded); 
    });
    
    router.get('/renewToken/:id', function(req, res) {
        User.findOne({_id: req.params.id}).select().exec(function(err, user) {
            if(err) throw err;
            if(!user) {
                res.json({success: false, message: 'No user was found'});
            }else {
                var newToken = jwt.sign({id: user._id, username: user.username, email: user.email, age: user.age, address: user.address, status:                      user.status, img: user.img, usertype: user.usertype}, secret, { expiresIn: '1h' });
                res.json({success: true, token: newToken});
            }
        });
    });
    
    router.get('/userType', function(req, res){
        User.findOne({_id: req.decoded.id}, function(err, user) {
            if(err) throw err;
            if(!user){
                res.json({success: false, message: "no user found"});   
            }else {
                res.json({success: true, usertype: user.usertype});
            }
        });
    });
    
    router.get('/admin', function(req, res) {
        var usertype = 'user';
        User.find({usertype: usertype}, function(err, users) {
            if(err) throw err;
            User.findOne({_id: req.decoded.id}, function(err, user) {
                if(err) throw err;
                if(!user){
                    res.json({success: false, message: 'No user found'});
                }else {
                    if(user.usertype === 'admin'){
                        if(!users) {
                            res.json({success: false, message: 'User not found'})
                        }else {
                            res.json({success: true, users: users, usertype: user.usertype});
                        }   
                    }else {
                        res.json({success: false});
                    }
                }
            });
        });
    });
    
    router.get('/home', function(req, res) {
        var usertype = 'user';
        User.find({usertype: usertype}, function(err, users) {
            if(err) throw err;
            User.findOne({_id: req.decoded.id}, function(err, user) {
                if(err) throw err;
                if(!user){
                    res.json({success: false, message: 'No user found'});
                }else {
                    if(user.usertype === 'user'){
                        if(!users) {
                            res.json({success: false, message: 'User not found'})
                        }else {
                            res.json({success: true, users: users, usertype: user.usertype});
                        }   
                    }else {
                        res.json({success: false});
                    }
                }
            });
        });
    });
    
    router.get('/account/:id', function(req, res) {
        var editUser = req.params.id;
        User.findOne({_id: editUser}, function(err, user) {
            if(err) throw err;
            if(!user){
                res.json({success: false, message: 'no user found'});
            }
            else{
                res.json({success: true, user: user});
            }
        });
    });
    
    router.put('/update', function(req, res) {
        var editUser    = req.body._id;
        var newUsername = req.body.username;
        var newAddress  = req.body.address;
        var newAge      = req.body.age;
        var newStatus   = req.body.status;
        
        console.log(newUsername);
        
        User.findOne({_id: editUser}, function(err, user) {
            if(err) throw err;
            else{
                user.username = newUsername;
                user.address = newAddress;
                user.age = newAge;
                user.status = newStatus;
                
                user.save(function(err) {
                    if(err){
                        console.log(err);
                    }else
                        res.json({success: true, message: 'Successfully Updated'});
                });
            }
        });
    });
    
    router.get('/games', function(req, res) {
        Game.find({}, function(err, games) {
            if(err) {
                throw err;
            }else {
                res.json({success: true, games: games});
            }
        });
    });
    
    router.put('/admin/:id', function(req, res) {
         var editUser = req.params.id;
        var status = 'Banned';
        User.findOne({_id: editUser}, function(err, user) {
            if(err) throw err;
            if(!user){
                res.json({success: false, message: 'no user found'});
            }
            else{
                user.status = status;
                user.save(function(err) {
                    if(err) {
                        throw err;
                    }else {
                        res.json({success: true, message: 'success'});
                    }
                });
                
            }
        });
    });

    router.put('/deactivate/:id', function(req, res) {
        var status = 'Deactivate';
        User.findOne({_id: req.params.id}).exec(function(err, user){
            if(err) throw err;
            user.status = status;
            user.save(function(err) {
                if(err) throw err;
                res.json({success: true, message: 'success'});
            });
        });
    });
        
    router.post('/addgames', function(req, res) {
            var mygame         = new MyGame();
            var mygameoffer    = new MyGameOffer();
            var mygamesservice = new MyGameService();
        
                if(req.body.status) {
            
                mygameoffer.userId           = req.body.userId;
                mygameoffer.gameId           = req.body.gameId; 
                mygameoffer.years_experience = req.body.experience;
                mygameoffer.game_level       = req.body.gamelevel;
                mygameoffer.goal_level       = req.body.levelgoal;
            
                mygameoffer.save(function(err) {
                    if(err) {
                        throw err;
                    }else {
                    res.json({success: true, message: 'successfully save to my games offer'});
                    }
                });
            }else if(req.body.offerservice){
                mygamesservice.userId           = req.body.userId;
                mygamesservice.gameId           = req.body.gameId; 
                mygamesservice.years_experience = req.body.experience;
                mygamesservice.service_fee      = req.body.servicefee;
                mygamesservice.game_level       = req.body.gamelevel;
                
                mygamesservice.save(function(err) {
                        if(err) {
                            throw err;
                        }else {
                        res.json({success: true, message: 'successfully save to my games service'});
                        }
                    });
            }
            else if(!req.body.status) {
                mygame.userId           = req.body.userId;
                mygame.gameId           = req.body.gameId; 
                mygame.years_experience = req.body.experience;
                mygame.game_level       = req.body.gamelevel;
            
                mygame.save(function(err) {
                    if(err) {
                        throw err;
                    }else {
                    res.json({success: true, message: 'successfully save to my games'});
                    }
                });
            }
                
            console.log(req.body.levelgoal)
            
            
        
    });
    
    router.post('/upload', function(req, res) {
        upload(req, res, function(err) {
            console.log(req.file);
            
            var gamename     = req.body.gamename;
            var minimumfee   = req.body.minimumfee;
            var maximumfee   = req.body.maximumfee;
            var minimumlevel = req.body.minimumlevel;
            var maximumlevel = req.body.maximumlevel;
            var yearcreated  = req.body.yearcreated;
            var yearpresent  = req.body.yearpresent;
            
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success: false, message: 'File size is too large. Max limit is 10MB' });
                } else if (err.code === 'filetype') {
                res.json({ success: false, message: 'Filetype is invalid. Must be .png' });
                } else {
                res.json({ success: false, message: 'Unable to upload file' });
                }
            } else {
                if (!req.file) {
                    res.json({ success: false, message: 'No file was selected' });
                } else {
                    var game = new Game();
                    game.img          = req.file.filename;
                    game.gamename     = gamename;
                    game.min_fee      = minimumfee;
                    game.max_fee      = maximumfee;
                    game.min_level    = minimumlevel;
                    game.max_level    = maximumlevel;
                    game.year_created = yearcreated;
                    game.year_today   = yearpresent;
                    
                
                    game.save(function(err, file) {
                        if(err) {
                            throw err;
                        }else {
                        res.json({ success: true, message: 'File uploaded!', file: file});
                        }
                    });
                
                }
            }
        });
    
    });
    
    router.get('/myoffergames', function(req, res) {
        MyGameOffer.find({})
                            .populate('userId')
                            .populate('gameId').exec(function(err, result) {
                            if(err) console.log(err);
                            res.json({success: true, result: result});
        })
                      
    });
    
    router.get('/mygames', function(req, res) {
        MyGame.find({})
                            .populate('userId')
                            .populate('gameId').exec(function(err, result) {
                            if(err) console.log(err);
                            res.json({success: true, result: result});
        })
                      
    });
    
    router.get('/servicegames', function(req, res) {
        MyGameService.find({})
                              .populate('userId')
                              .populate('gameId').exec(function(err, result) {
                              if(err) console.log(err);
                              res.json({success: true, result: result});
        })
    });
    router.get('/viewuser/:id', function(req, res) {
        var user_id = req.params.id;
        User.findOne({_id: user_id}, function(err, user) {
            if(err) throw err;
            MyGameOffer.find({})
                                .populate('userId')
                                .populate('gameId').exec(function(err, mygameoffer){
                                if(err) throw err;
                                MyGame.find({})
                                               .populate('userId')
                                               .populate('gameId').exec(function(err, mygame) {
                                               if(err) throw err;
                                               MyGameService.find({})
                                                                     .populate('userId')
                                                                     .populate('gameId').exec(function(err, mygameservice) {
                                                                         if(err) throw err;
                                                                         Rating.find({})
                                                                                        .populate('pilotseekerId')
                                                                                        .populate('pilotplayerId').exec(function(err, rating) {
                                                                                            if(err) throw err;
                                                                                            res.json({success: true, 
                                                                                                      user: user, 
                                                                                                      mygameoffer:mygameoffer, 
                                                                                                      mygame:mygame, 
                                                                                                      mygameservice:mygameservice,
                                                                                                      rating:rating});
                                                                                            console.log(mygameservice);
                                                                                        });
                                                                     
                                                });
                                });
            });
        });
        
    });
    
    router.post('/sendrequest', function(req, res) {
       var Pilotedgame = new PilotedGame();
       
        Pilotedgame.pilotseekerId  = req.body.pilotseekerId;
        Pilotedgame.pilotplayerId  = req.body.pilotplayerId;
        Pilotedgame.gameId         = req.body.gameId;
        Pilotedgame.pilotplayerFee = req.body.pilotplayerfee;
        Pilotedgame.goal           = req.body.goal;
        Pilotedgame.game_level     = req.body.game_level;
        Pilotedgame.level_milestone = req.body.milestone;
        
        Pilotedgame.save(function(err, result) {
            if(err) throw err;
            res.json({success: true, message: 'Successfully Send!'});
        });
                      
    });
    
    router.get('/getrequest/', function(req, res) {
        var request_id = req.params.id;
        PilotedGame.find({}).populate('pilotplayerId')
                            .populate('pilotseekerId')
                            .populate('gameId')
                            .exec(function(err, result) {
                            if(err) throw err;
                            res.json({success: true, result:result});
        });
    });
    
    router.put('/acceptrequest/:id', function(req, res) {
        var request_id = req.params.id;
        var status = 'Ongoing';
        PilotedGame.findOne({_id: request_id}, function(err, result){
            if(err) throw err;
    
            result.status = status;   
            result.save(function(err) {
                if(err) throw err;
                res.json({success: true});
            });
        });
    });
    
    router.post('/recommend', function(req, res){
        
        var recommend = new Recommend();
        recommend.recommend_to = req.body.recommendto;
        recommend.pilotplayerId = req.body.recommendfrom;
        recommend.pilotseekerId = req.body.gameowner;
       
        recommend.save(function(err) {
            if(err) throw err;
            res.json({success:true, message:'Successfully Recommended'});
        });
    });

    router.get('/getrecommend', function(req, res) {
        Recommend.find({})
                          .populate('pilotplayerId')
                          .populate('pilotseekerId')
                          .populate('recommend_to').exec(function(err, result) {
                              if(err) throw err;
                              res.json({success: true, result:result});
                          });
    });
    
    router.get('/monitorgames', function(req, res){
                PilotedGame.find({})
                                    .populate('pilotplayerId')
                                    .populate('pilotseekerId')
                                    .populate('gameId').exec(function(err, result) {
                                    if(err) throw err;
                                    res.json({success: true, result:result});
                            console.log(result);
        });
        
    });

    router.get('/getpilot/:game_id/:game_level/:years_experience/:professional_fee', function(req, res){
        var gameId          = req.params.game_id;
        var gameLevel       = req.params.game_level;
        var yearsExperience = req.params.years_experience;
        var professionalFee = req.params.professional_fee;


        MyGameService.find({gameId: gameId, }).where('game_level').gte(gameLevel)
                                              .where('years_experience').gte(yearsExperience)
                                              .where('service_fee').lte(professionalFee)
                                              .populate('gameId')
                                              .populate('userId').exec(function(err, result) {
                                                if(err) throw err;
                                                Rating.find({}).exec(function(err, rating) {
                                                    if(err) throw err;
                                                    res.json({success: true, result:result, rating:rating});
                                                });
                                                console.log(result);
                                                });
    });

    router.post('/updatepilotedgames/:id', function(req, res) {
        var status = 'Done';
        PilotedGame.findOne({_id: req.params.id}, function(err, games) {
            if(err) throw err;
            games.status = status;

            games.save(function(err){
                if(err) throw err;
                res.json({success:true});
            });
        });



    });

    router.post('/ratesuser', function(req, res){
       var rating = new Rating();
       
       rating.pilotseekerId = req.body.pilot_seeker;
       rating.pilotplayerId = req.body.pilot_player;
       rating.ratings       = req.body.rates;
       rating.review        = req.body.comments;

       rating.save(function(err) {
        if(err) throw err;
        res.json({success: true, message: 'done!'});
       });
    });

    router.post('/complaintssuser', function(req, res){
        var complaint = new Complaint();
        
        complaint.pilotseekerId = req.body.pilot_seeker;
        complaint.pilotplayerId = req.body.pilot_player;
        complaint.complaints    = req.body.complaints;
 
        complaint.save(function(err) {
         if(err) throw err;
         res.json({success: true, message: 'done!'});
        });

    });

    router.get('/getmyratings/', function(req, res) {
        

        Rating.find({pilotplayerId: req.decoded.id})
                                                    .populate('pilotseekerId')
                                                    .populate('pilotplayerId')
                                                    .exec(function(err, result) {
            if(err) throw err;
            res.json({success: true, rating: result});
        });
        console.log(req.decoded.id);
    });

    router.get('/getcomplaints', function(req, res) {
        // Complaint.find({}, function(err, result){
        //     if(err) throw err;
        //     res.json({success: true, data: result});
        // });
        Complaint.find({}).populate('pilotseekerId')
                          .populate('pilotplayerId').exec(function(err, result){
                            if(err) throw err;
                            res.json({success: true, data:result});
                           });
    });

    router.post('/updategames', function(req, res) {
        var pilotedgame = new PilotedGame();
            
        PilotedGame.findOne({_id: req.body.id}, function(err, game) {
            if(err) throw err;
            if(!game){
                res.json({success: false, message: 'no user found'});
            }
            else{
                game.game_level = req.body.game_level;
                game.level_gain = req.body.level_gain;
                game.save(function(err) {
                    if(err) {
                        throw err;
                    }else {
                        res.json({success: true, message: 'success'});
                    }
                });
                
            }
        });
    });

    router.get('/getcurrentgames/:id', function(req, res) {
        PilotedGame.findOne({_id: req.params.id}).exec(function(err, result) {
            if(err) throw err;
            res.json({success: true, result: result});
        });
    })
        
    return router;
}