angular.module('userServices', [])

.factory('User', function($http) {
    var userFactory = {};
    
    userFactory.getUserType = function(){
        return $http.get('/api/userType/');  
    };
    
    userFactory.getUsers = function() {
        return $http.get('/api/admin/');
    };
    
    userFactory.getAllUsers = function() {
        return $http.get('/api/home/');
    };
    
    userFactory.getUser = function(id) {
        return $http.get('/api/account/' + id);
    };
    
    userFactory.editUser = function(userData) {
        return $http.put('/api/update', userData);  
    };
    
    userFactory.getAllGames = function() {
        return $http.get('/api/games/');
    }
    
    userFactory.bannedUsers = function(id) {
        return $http.put('/api/admin/' + id);
    }

    userFactory.deactivateAccount = function(id){
        return $http.put('api/deactivate/'+id);
    }
    
    userFactory.create = function(addData) {
        return $http.post('api/addgames/', addData);
    }
    
    userFactory.getMyOfferGames = function() {
        return $http.get('api/myoffergames/');
    }
    
    userFactory.getMyGames = function() {
        return $http.get('api/mygames/');
    }
    
    userFactory.viewUser = function(id) {
        return $http.get('api/viewuser/'+ id);
    }
    
    userFactory.sendRequest = function(requestObject) {
        return $http.post('api/sendrequest', requestObject);
    }
    
    userFactory.getRequest = function(id) {
        return $http.get('api/getrequest/');
    }
    
    userFactory.acceptRequest = function(id) {
        return $http.put('api/acceptrequest/'+ id);
    }
    
    userFactory.recommendUser = function(recommendObject) {
        return $http.post('api/recommend', recommendObject);
    }
    
    userFactory.getMonitorGames = function() {
        return $http.get('api/monitorgames');
    }

    userFactory.getMyGamesService = function(id) {
        return $http.get('api/servicegames');
    }

    userFactory.getAllRecommend = function() {
        return $http.get('api/getrecommend');
    }

    userFactory.getPilot = function(game_id, game_level, years_experience, professional_fee) {
        return $http.get('api/getpilot/'+ game_id +'/'+ game_level +'/'+ years_experience +'/'+ professional_fee);
    }
    
    userFactory.updatePilotedGame = function(id) {
        return $http.post('api/updatepilotedgames/'+ id);
    }

    userFactory.ratesUser = function(rateObjects) {
        return $http.post('api/ratesuser', rateObjects);
    }

    userFactory.complaintsUser = function(complaintsObjects) {
        return $http.post('api/complaintssuser', complaintsObjects);
    }

    userFactory.getMyRatings = function() {
        return $http.get('api/getmyratings/');
    }

    userFactory.getAllComplaints = function() {
        return $http.get('api/getcomplaints');
    }

    userFactory.updateGame = function(updateObject) {
        return $http.post('api/updategames', updateObject);
    }

    userFactory.sendRecom = function(requestRecom) {
        return $http.post('api/sendrequest', requestRecom);
    }

    userFactory.getCurrentGames = function(id) {
        return $http.get('api/getcurrentgames/' + id);
    }
    return userFactory;

});