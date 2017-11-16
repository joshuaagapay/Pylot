angular.module('monitoringControllers', ['jkAngularRatingStars', 'authServices', 'userServices'])

.controller('MonitorCtrl', function($http, User, Auth, $scope, $timeout) {
   var vm = this;
   $scope.currentpiloted = [];
   $scope.gamemonitoring = [];
   $scope.donepiloted    = [];
    
    
     Auth.getUser().then(function(data) {
        vm.currentUser = data.data.id;
    });
    
    

    
    // User.getMyGames().then(function(data) {
    //     var result = data.data.result;
    //     $scope.mygames = [];
    //     for(var i = 0; i<result.length; i++){
    //         if(vm.currentUser === result[i].userId._id){
    //              $scope.mygames.push(data.data.result[i]);            
    //         }
    //     }
    // });

    
    User.getMonitorGames().then(function(data) {
        console.log(vm.currentUser);
        var result = data.data.result;
        var status = data.data.result;
        for(var i = 0; i<result.length; i++){
            if(vm.currentUser === result[i].pilotseekerId._id && status[i].status === 'Ongoing'  ){
                $scope.gamemonitoring.push(data.data.result[i]);
            }else if(vm.currentUser === result[i].pilotplayerId._id && status[i].status === 'Ongoing'){
                $scope.currentpiloted.push(data.data.result[i]);
            }else if(vm.currentUser === result[i].pilotseekerId._id && status[i].status === 'Done'){
                $scope.donepiloted.push(data.data.result[i]);
            }
            // else if(vm.currentUser === result[i].pilotplayerId._id && status[i].status === 'Done'){
            //     $scope.donepiloted.push(data.data.result[i]);
            // }

        }
        console.log(result);
   
    });

    vm.showUpdategames = function(id) {
        showAddgamesModal();
        $scope.levelgain = 0;
        $scope.id = id;

        User.getCurrentGames($scope.id).then(function(data) {
            console.log(data);
            $scope.milestone      = data.data.result.level_milestone;
            $scope.goal           = data.data.result.goal;
            $scope.levelgained    = data.data.result.level_gain;
            $scope.levelremain    = data.data.result.goal - data.data.result.game_level;
            $scope.pilotplayerFee = data.data.result.pilotplayerFee;
            $scope.current_level  = data.data.result.game_level;
            if(vm.currentUser === data.data.result.pilotplayerId){
                $scope.process = true;
                if($scope.current_level === $scope.goal){
                    $scope.done = true;
                    $scope.process = false;
                }
            }
            $scope.progress = ($scope.levelgained * 100 / $scope.milestone).toFixed(0);

           
        });

    }

    $scope.donePilot = function() {
        
        User.updatePilotedGame($scope.id).then(function(data) {
            console.log(data);
        });  
        $scope.alert = "Successfully Done!";
        $timeout(function() {
            hideAddgamesModal();
         }, 1500);
    }

    $scope.gain = function() {
        
        if($scope.levelremain !== 0){
            $scope.levelremain--;
            $scope.levelgain++;
        }else{
            console.log('You have reach the goal level');
        }
        // User.updatePilotedGame($scope.id).then(function(data) {
        //     console.log(data);
        // });  
    }

    $scope.updateGames = function(levelgain) {
        updateObject = {};

        updateObject.id = $scope.id;
        updateObject.game_level =  $scope.current_level + $scope.levelgain;
        updateObject.level_gain = $scope.levelgained + $scope.levelgain;

        User.updateGame(updateObject).then(function(data){
            if(data.data.success){
                console.log(data);
                $scope.alert = "Successfully Updated!";
            }
        });
        $timeout(function() {
            hideAddgamesModal();
         }, 1500);
        
    }
    // if(vm.currentUser === $scope.donepiloted[0].pilotplayerId._id){
    //     $scope.buttons = false;   
    // }
    $scope.buttons = true;
    
    vm.showratePilot = function(id) {
        showratesGamesModal();
        console.log(id);
        $scope.user.id = id;
        $scope.firstRate = 0;
        $scope.secondRate = 3;
        $scope.readOnly = true;
        $scope.onItemRating = function(rating){
          alert('On Rating: ' + rating);
        };
    }

    $scope.ratePilot = function(comments) {
        var rateObjects = {};

        rateObjects.pilot_seeker = vm.currentUser;
        rateObjects.pilot_player = $scope.user.id;
        rateObjects.rates        = $scope.firstRate;
        rateObjects.comments    = $scope.comments;
        console.log(rateObjects);

        User.ratesUser(rateObjects).then(function(data){
            console.log(data);
        });
        $scope.message = "Successfully Rate!";
        $timeout(function() {
            hideratesGamesModal();
         }, 1500);

    }

    vm.showcomplaintsPilot = function() {
        $("#complaintsGamesModal").modal({backdrop: "static"});
    }

    $scope.complaintsPilot = function(complaints) {
        var complaintsObjects = {};

        complaintsObjects.pilot_seeker = vm.currentUser;
        complaintsObjects.pilot_player = $scope.user.id;
        complaintsObjects.complaints    = $scope.complaints;

        User.complaintsUser(complaintsObjects).then(function(data){
            console.log(data);
        });
        

    }

    vm.closeModal = function() {
        hideAddgamesModal();
    }

    var showAddgamesModal = function(){
        $("#updateGamesModal").modal({backdrop: "static"});
    }

    var showratesGamesModal = function() {
        $("#ratesGamesModal").modal({backdrop: "static"});
        
    }

    var hideratesGamesModal = function(){
        $("#ratesGamesModal").modal('hide');
    }
    
    var hideAddgamesModal = function(){
        $("#updateGamesModal").modal('hide');
    }



    var showPromptModal2 = function() {
        $("#promptModal1").modal({backdrop: "static"});
    }
    var hidePromptModal2 = function() {
        $("#promptModal1").modal('hide');
    }
    
    $scope.id = true;
});

