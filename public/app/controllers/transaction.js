angular.module('transactionControllers', ['jkAngularRatingStars','authServices', 'userServices'])

.controller('TransCtrl', function($http, User, Auth, $scope, $routeParams, $route,  $rootScope, $location, $timeout ) {
   var user = this;
   $scope.pilotedgame = [];
   $scope.viewcurrentgame = [];

   var game_id;
   var game_level;
   var years_experience;
   var professional_fee;
   var goal_level;

    Auth.getUser().then(function (data){
        user.id = data.data.id;
        console.log(data);
    });

    User.getMyOfferGames().then(function(data) {
        var result = data.data.result;
        console.log(result);
        for(var i = 0; i<result.length; i++){
            if(user.id === result[i].userId._id){
                $scope.viewcurrentgame.push(result[i]);
            }
        }
    });
   
    $scope.change = function () {
        var result = $scope.viewcurrentgame;
    
        for(var i = 0; i < result.length; i++){
            if($scope.id === result[i].gameId._id){
                $scope.proMinslider = {
                    value: result[i].gameId.min_fee,
                    options: {
                        floor: result[i].gameId.min_fee,
                        ceil: result[i].gameId.max_fee,
                        step: 5
                    }
                };
            
                $scope.yearsMinslider = {
                    value: 1,
                    options: {
                        floor: 1,
                        ceil: result[i].gameId.year_today - result[i].gameId.year_created,
                        step: 1
                    }
                };
            
                $scope.gameLevelMinslider = {
                    value: result[i].gameId.min_level,
                    options: {
                        floor: result[i].gameId.min_level,
                        ceil: result[i].gameId.max_level,
                        step: 1
                    }
                }; 
                $scope.goal_level = result[i].goal_level;
                $scope.game_name  = result[i].gameId.game_name;
                $scope.game_level = result[i].game_level;
                
            }
        }
    }
    
    $scope.findApilot = function(id) {
        
        game_id          = $scope.id;
        game_level       = $scope.gameLevelMinslider.value;
        years_experience = $scope.yearsMinslider.value;
        professional_fee = $scope.proMinslider.value;
        goal_level       = $scope.goal_level;
            
            
        User.getPilot(game_id, game_level, years_experience, professional_fee).then(function(data) {
            var results = data.data.result;
            var rating = data.data.rating;
            var status = 'Active';
            $scope.pilotplayers = []; 
            for(var i = 0; i<results.length; i++){
                if(results[i].userId.status === status){
                    var count = 0;
                    var total = 0;          
                    for(var y = 0; y<rating.length; y++ ){
                        if(results[i].userId._id === rating[y].pilotplayerId){
                            count++;
                            total = total + rating[y].ratings;
                        }
                    }
                    if (total === 0){
                        $scope.ratings = 0;
                    }else{
                        $scope.ratings = (total/count).toFixed(1);
                        $scope.readOnly = true;
                    }
                    $scope.pilotplayers.push({_id: results[i].userId._id,
                                              name: results[i].userId.username,
                                              img: results[i].userId.img,
                                              service_fee: results[i].service_fee,
                                              ratings: $scope.ratings
                                            }); 
                }
            }  
           console.log($scope.pilotplayers);

        });
        
    }

    $scope.id = false;
    $scope.sendRequest = function(pilotplayerId, service_fee){
        var requestObject = {};
        
        requestObject.pilotseekerId  = user.id;
        requestObject.pilotplayerId  = pilotplayerId;
        requestObject.gameId         = $scope.id;
        requestObject.pilotplayerfee = service_fee;
        requestObject.goal           = $scope.goal_level;
        requestObject.game_level     = $scope.game_level;
        requestObject.milestone      = $scope.goal_level - $scope.game_level;
        
        
        User.sendRequest(requestObject).then(function(data) {
            console.log(data);
        });
        console.log(requestObject);
        $scope.pilot = false;
        $scope.alert = 'Successfully Send!';
        showPromptModal();
        $timeout(function() {
            hidePromptModal();
         }, 1500);
       
        
    };

    // //Recommend Sent
    // $scope.sendRecom = function(pilotplayerId){
    //     var requestRecom = {};
        
    //     // requestObject.pilotseekerId  = user.id;
    //     requestRecom.reco = pilotplayerId;
    //     // requestObject.gameId         = $scope.id;
    //     // requestObject.pilotplayerfee = service_fee;
    //     // requestObject.goal           = $scope.goal_level;
    //     // requestObject.game_level     = $scope.game_level;
        
        
    //     // User.sendRecom(requestRecom).then(function(data) {
    //     //     console.log(data);
    //     // });
    //     console.log(requestRecom);
    //     $scope.pilot = false;
        
    // };

    $scope.pilot = true;
     User.getRequest().then(function(data) {
        var result = data.data.result;
        for(var i = 0; i<result.length; i++){
            if(user.id === result[i].pilotplayerId._id && result[i].status === 'Pending'){
                    $scope.pilotedgame.push(data.data.result[i]);
            }
        }
        
     });

    User.getAllRecommend().then(function(data) {
        var result = data.data.result;
            $scope.recommendation = [];
           for(var i = 0; i<result.length; i++){
               if(user.id === result[i].pilotseekerId._id){
                   $scope.recommendation.push(data.data.result[i]);
               }
           } 
    });
    $scope.acceptRequest = function(id) {
        User.acceptRequest(id).then(function(data){
            console.log(data.data.success);
            
        });
        $scope.pilot = false;
        $scope.alert = 'Successfully Accepted!';
        showPromptModal1();
        $timeout(function() {
            hidePromptModal1();
         }, 1500);
    }
    
    User.getAllUsers().then(function(data) {
        var result = data.data.users;
        $scope.recommendusers = [];
        if(data.data.success){
            for(var i = 0; i< result.length; i++){
                if(user.id !== result[i]._id){
                    $scope.recommendusers.push(result[i]);
                }
            }
        
        }
    });
    
    $scope.recommend = function(recommendId) {
        var recommendObject = {};
        recommendObject.recommendto   = $scope.recommendId;
        recommendObject.gameowner     = $routeParams.id;
        recommendObject.recommendfrom = user.id;
        User.recommendUser(recommendObject).then(function(data) {
            console.log(data.data.success);
        });
        console.log(recommendObject);
    }
    
    $scope.hide_id = true;

    var showPromptModal = function() {
        $("#promptModal").modal({backdrop: "static"});
    }
    var hidePromptModal = function() {
        $("#promptModal").modal('hide');
    }
    var showPromptModal1 = function() {
        $("#promptModal1").modal({backdrop: "static"});
    }
    var hidePromptModal1 = function() {
        $("#promptModal1").modal('hide');
    }
    
});