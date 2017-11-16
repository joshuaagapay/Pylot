angular.module('fbControllers', ['authServices'])

.controller('facebookCtrl', function(Auth, AuthToken, $routeParams, $location) {                
    
    var user = this;
    Auth.login($routeParams.token);
    Auth.getUser().then(function(data) {
        if(data.data.status === 'Banned') {
            AuthToken.setToken();
            $location.path('/bannedpage');
        }else if(data.data.usertype === 'admin') {
            $location.path('/admin');
        }else if(data.data.usertype === 'user') {
            if(data.data.status === 'Deactivate') {
                AuthToken.setToken();
                $location.path('/activate');
            }else {
                $location.path('/home'); 
            }
        }else
            $location.path('/home');
    });
             
});