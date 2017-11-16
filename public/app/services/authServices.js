angular.module('authServices', [])

.factory('AuthToken', function($window) {
    var authTokenFactory = {};
        
        authTokenFactory.setToken = function(token) {
        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
            }
        };
        
        authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
        };
    
    return authTokenFactory;
})

.factory('Auth', function(AuthToken, $http) {
   var authFactory = {};
    
        authFactory.login = function(token) {
            AuthToken.setToken(token);
        };
        
        authFactory.logout = function() {
            AuthToken.setToken();
        };
        
        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };
    
        authFactory.renewSession = function(id) {
            return $http.get('api/renewToken/' + id)
        };
    
        authFactory.getUser = function() {
            if (AuthToken.getToken()) {
                return $http.post('/api/me');
            } else {
                $q.reject({ message: 'User has no token' });
            }
        };
    return authFactory;
})

.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorsFactory = {};
        authInterceptorsFactory.request = function(config) {
            var token = AuthToken.getToken();  
            if (token) config.headers['token'] = token; 

            return config;   
        };
    return authInterceptorsFactory;

});
         
         
    

