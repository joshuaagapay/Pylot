var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    
    $routeProvider
    .when('/', {
        templateUrl:'app/views/login.html',
        authenticated: false

    })
    
    .when('/login', {
        templateUrl:'app/views/login.html',
        authenticated: false
    })
     .when('/bannedpage', {
        templateUrl:'app/views/bannedpage.html',
        authenticated: false
    })
    
    .when('/activate', {
        templateUrl:'app/views/activate.html',
        controller: 'editCtrl',
        controllerAs: 'edit',
        authenticated: false
    })
    
    .when('/home', {
        templateUrl: 'app/views/home.html',
        controller: 'TransCtrl',
        controllerAs: 'trans',
        authenticated: true
 
    })
    
    .when('/account/:id', {
        templateUrl: 'app/views/account.html',
         controller: 'editCtrl',
        controllerAs: 'edit',
        authenticated: true,
    })
    
    .when('/facebook/:token', {
        templateUrl: 'app/views/facebook.html',
        controller: 'facebookCtrl',
        controllerAs: 'facebook',
        authenticated: false
    })
    
    .when('/admin', {
        templateUrl: 'app/views/admin.html',
        authenticated: true,
        usertype: ['admin']
    })
    
    .when('/portfolio', {
        templateUrl: 'app/views/portfolio.html',
        controller: 'AddCtrl',
        controllerAs: 'addgames',
        authenticated: true,
    })
    
    .when('/viewuser/:id', {
        templateUrl: 'app/views/viewuser.html',
        controller: 'ViewCtrl',
        controllerAs: 'viewuser',
        authenticated: true
    })
    
    .when('/games', {
        templateUrl: 'app/views/games.html',
        controller: 'uploadCtrl',
        controllerAs: 'upload',
        authenticated: true,
        usertype: ['admin']
    })
    
    .when('/addgames', {
        templateUrl: 'app/views/addgames.html',
        controller: 'AddCtrl',
        controllerAs: 'addgames',
        authenticated: true,
    })
    
    .when('/request', {
        templateUrl: 'app/views/request.html',
        controller: 'TransCtrl',
        controllerAs: 'trans',
        authenticated: true,
    })
    
    .when('/hirepilot/:id', {
        templateUrl: 'app/views/hirepilot.html',
        controller: 'TransCtrl',
        controllerAs: 'trans',
        authenticated: true,
    })
    
    .when('/recommendation', {
        templateUrl: 'app/views/recommendation.html',
        controller: 'TransCtrl',
        controllerAs: 'trans',
        authenticated: true,
    })
    
    .when('/recommendto/:id', {
        templateUrl: 'app/views/recommendto.html',
        controller: 'TransCtrl',
        controllerAs: 'trans',
        authenticated: true,
    })
    
    .when('/monitoring', {
        templateUrl: 'app/views/monitoring.html',
        controller: 'MonitorCtrl',
        controllerAs: 'monitor',
        authenticated: true,
    })
    
    .otherwise({redirectTo: '/'});
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.run(['$rootScope', 'Auth', 'User', '$location', function($rootScope, Auth, User, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if(next.$$route.authenticated == true){
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }else if(next.$$route.usertype){
                User.getUserType().then(function(data) {
                   if(next.$$route.usertype[0] !== data.data.usertype){
                        event.preventDefault();
                        $location.path('/home');
                   } 
                });
            }
                
        }else if(next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/home');
            }
            
        }        
    });
    
}]);

