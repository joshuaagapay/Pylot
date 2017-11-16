angular.module('portfolioControllers', ['jkAngularRatingStars','rzModule','authServices', 'userServices'])

.controller('AddCtrl', function($http, User, Auth, $scope, $routeParams) {
   var add = this;
    $scope.data = [];
    $scope.reviews = [];

    Auth.getUser().then(function(data){
        add.user_id = data.data.id;
    });
    console.log(add.user_id);
    User.getMyRatings().then(function(data) {
        var total = 0;
        var count = 0;
        var result = data.data.rating;
        if(data.data.success){
            for(var i=0; i<result.length; i++){
                if(add.user_id === result[i].pilotplayerId._id){
                    if (isNaN(result[i].ratings)){
                        var temp = 0;
                    }else{
                        var temp = result[i].ratings;
                    }
                    count++;
                    total = total + temp;
                    $scope.reviews.push({comments: result[i].review,
                                         image: result[i].pilotseekerId.img,
                                         user: result[i].pilotseekerId.username,
                                         rate: temp});
                }
            }
            if (isNaN(temp)){
                $scope.secondRate = 0;
            }else{
                $scope.secondRate = (total / count).toFixed(1);
            }
            console.log(data);
            $scope.readOnly = true;
        }
    });
    
    User.getAllGames().then(function(data) {
        console.log(add.user_id);
        var result = data.data.games;
        for(var i = 0; i<result.length; i++){
            var gameid      = result[i]._id;
            var img         = result[i].img;
            var gamename    = result[i].gamename;
            var minlevel    = result[i].min_level;
            var maxlevel    = result[i].max_level;
            var minfee      = result[i].min_fee;
            var maxfee      = result[i].max_fee;
            var yearcreated = result[i].year_created;
            var yearetoday  = result[i].year_today;
            var yearslength = yearetoday - yearcreated; 
            
            $scope.data.push({game_id: gameid, game_img: img, game_name: gamename, min_level: minlevel, max_level: maxlevel, min_fee: minfee, max_fee: maxfee, years_experience: yearslength });
            
        } 
        console.log($scope.data);
    });

    $scope.change = function () {
        var result = $scope.data;
          
      for(var i = 0; i < result.length; i++){
            if($scope.id === result[i].game_id){
                $scope.feeMinslider = {
                    value: result[i].min_fee,
                    options: {
                        floor: result[i].min_fee,
                        ceil: result[i].max_fee,
                        step: 5
                    }
                };
            
                $scope.expMinslider = {
                    value: 1,
                    options: {
                        floor: 1,
                        ceil: result[i].years_experience,
                        step: 1
                    }
                };
            
                $scope.levelMinslider = {
                    value: result[i].min_level,
                    options: {
                        floor: result[i].min_level,
                        ceil: result[i].max_level,
                        step: 1
                    }
                }; 

                $scope.goalMinslider = {
                    value: result[i].min_level,
                    options: {
                        floor: result[i].min_level,
                        ceil: result[i].max_level,
                        step: 1
                    }
                }

            }
        }
    }

    $scope.offerservice = false;
    $scope.status = false;
     Auth.getUser().then(function(data) {
        add.currentUser = data.data.id;
    });
    
    User.getMyOfferGames().then(function(data) {
        var result = data.data.result;
        $scope.mygamesoffer = [];
        for(var i = 0; i<result.length; i++){
            if(add.currentUser === result[i].userId._id){
                $scope.mygamesoffer.push(data.data.result[i]);
            }
        }
    });
    
    User.getMyGames().then(function(data) {
        var result = data.data.result;
        $scope.mygames = [];
        for(var i = 0; i<result.length; i++){
            if(add.currentUser === result[i].userId._id){
                 $scope.mygames.push(data.data.result[i]);            
            }
        
        }
        
    });

    User.getMyGamesService().then(function(data) {
        var result = data.data.result;
        $scope.mygamesservice = [];

        for(var i = 0; i<result.length; i++){
            if(add.currentUser === result[i].userId._id){
                $scope.mygamesservice.push(data.data.result[i]);
            }
        }
        console.log(result);
    });
    add.addgames = function() {
        showAddgamesModal();
    }
    add.closeModal = function() {
        hideAddgamesModal();
    }
    $scope.addGames = function(id, status, offerservice) {
        var gamesObject = {};
        console.log('form submitted');
            
            gamesObject.gameId       = $scope.id;
            gamesObject.userId       = add.currentUser;
            gamesObject.experience   = $scope.expMinslider.value;
            gamesObject.servicefee   = $scope.feeMinslider.value;
            gamesObject.gamelevel    = $scope.levelMinslider.value;
            gamesObject.status       = $scope.status;
            gamesObject.offerservice = $scope.offerservice;
            gamesObject.levelgoal    = $scope.goalMinslider.value;

        User.create(gamesObject).then(function(data){
            console.log(data);
            $scope.message = data.data.message;
        });                   
    };
    
    var showAddgamesModal = function(){
        $("#addgamesModal").modal({backdrop: "static"});
    }
    
    var hideAddgamesModal = function(){
        $("#addgamesModal").modal('hide');
    }
    
})



.controller('ViewCtrl', function(Auth, AuthToken, User, $scope, $routeParams, $route) {
    var viewuser = this;
    var viewuser = this;
    
    User.viewUser($routeParams.id).then(function(data){
        var mygame = data.data.mygame;
        var mygameoffer = data.data.mygameoffer;
        var mygameservice = data.data.mygameservice;
        var reviews = data.data.rating;
        var count = 0;
        var total = 0;
        $scope.mygame = [];
        $scope.mygameoffer = [];
        $scope.mygameservice = [];
        $scope.reviews = [];

        viewuser.currentUser = data.data.user._id;
        viewuser.username    = data.data.user.username;
        viewuser.address     = data.data.user.address;
        viewuser.age         = data.data.user.age;
        viewuser.email       = data.data.user.email;
        viewuser.status      = data.data.user.status;
        viewuser.img         = data.data.user.img;
        
        for(var i = 0; i < mygame.length; i++){
           if($routeParams.id === mygame[i].userId._id)
               $scope.mygame.push(data.data.mygame[i]);
        }
        
       for(var i = 0; i < mygameoffer.length; i++){
           if($routeParams.id === mygameoffer[i].userId._id)
               $scope.mygameoffer.push(data.data.mygameoffer[i]);
        }

        for(var i = 0; i < mygameservice.length; i++){
            if($routeParams.id === mygameservice[i].userId._id)
            $scope.mygameservice.push(data.data.mygameservice[i]);
            
        }
        
            for(var i=0; i<reviews.length; i++){
                if($routeParams.id === reviews[i].pilotplayerId._id){
                    if (isNaN(reviews[i].ratings)){
                        var temp = 0;
                    }else{
                        var temp = reviews[i].ratings;
                    }
                    count++;
                    total = total + temp;
                    $scope.reviews.push({comments: reviews[i].review,
                                         image: reviews[i].pilotseekerId.img,
                                         user: reviews[i].pilotseekerId.username,
                                         rate: temp});
                }
            }
            if (isNaN(temp)){
                $scope.secondRate = 0;
            }else{
                $scope.secondRate = (total / count).toFixed(1);
            }
            console.log($scope.reviews);
            $scope.readOnly = true;


         console.log(data);
    });
  

});
