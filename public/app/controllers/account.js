angular.module('acntControllers', ['authServices', 'userServices', 'fileModelDirective', 'uploadFileService'])

.controller('AccountCtrl', function(Auth, User, AuthToken, $location, $rootScope, $window, $interval, $timeout, $route, $scope, $routeParams, uploadFile) {
    
    var user = this;
    this.fbLogin = function() {
        $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook/';
    };
    
    this.Logout = function() {
        showModal(2);
    };
    
    this.checkSession = function() {
        if(Auth.isLoggedIn()){
            user.checkingSession = true;
            var interval = $interval(function() {
                var token = $window.localStorage.getItem('token');
                    if(token === null){
                        $interval.cancel(interval);
                    }else{
                        self.parseJwt = function(token){
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse($window.atob(base64));
                        };
                        var expireTime = self.parseJwt(token);
                        var timeStamp = Math.floor(Date.now() / 1000);
                        var timeCheck = expireTime.exp - timeStamp;
                        if(timeCheck <= 20){
                            console.log('token expired');
                            showModal(1);
                            $interval.cancel(interval);
                        }else{
//                            console.log('token will expire in' + ' ' + timeCheck +'sec');
                        }
                    }
            }, 2000);
        }
    };

    this.checkSession();
    
    var showModal = function(option) {         
        user.choice = false;
        user.modalHeader = undefined;
        user.modalBody = undefined;
        user.hideButton = false;
        if(option === 1){
            user.modalHeader = 'Timeout Warning';
            user.modalBody = 'Your session has expire would you like to continue?';
            $("#myModal").modal({backdrop: "static"});
        }else if(option === 2){
            user.hideButton = true;
            user.modalHeader = 'Logging Out';
             $("#myModal").modal({backdrop: "static"});
             $timeout(function() {
                Auth.logout();
                $location.path('/login');
                hideModal();
                $route.reload(); 
             }, 2000);
        }
         $timeout(function() {
                if(!user.choice){
                
                }
        }, 4000);
    };
    
    this.renewSession = function() {
        user.choice = true;
        Auth.renewSession(user.id).then(function(data) {
                console.log(data);
                AuthToken.setToken(data.data.token);
                user.checkSession();
        });
        hideModal();
    };
    
    this.endSession = function() {
        user.choice = true;
        Auth.logout();
        $location.path('/login');
        hideModal();
        $route.reload(); 
    };
    
    this.ViewUsers = function(username) {
        User.ViewUsers(username).then(function(data) {
            console.log(data.data.success);
        });
    };
    
    this.Banned = function(id) {
        User.bannedUsers(id).then(function(data) {
            console.log(data.data.success);
        });
    };
    
//    this.HirePilot = function(id) {
//        User.hireUsers(id).then(function(data) {
//            console.log(data.data.success);
//        });
//    };
    
    var hideModal = function() {
        $("#myModal").modal('hide');
    };
    
    $rootScope.$on('$routeChangeStart', function() {
        
        if(!user.checkSession()){
            user.checkSession();
        }
        if(Auth.isLoggedIn()){
        user.isLoggedIn = true;
        console.log('user logged in');
        Auth.getUser().then(function (data){
            user.id       = data.data.id;
            user.username = data.data.username;
            user.email    = data.data.email;
            user.age      = data.data.age;
            user.address  = data.data.address;
            user.status   = data.data.status;
            user.img      = data.data.img;
        });
        }else{
            user.isLoggedIn = false;
            console.log('user is not logged in');
        }
        
        if($location.hash() == '_=_') $location.hash(null);
    });
    
    $rootScope.$on('$routeChangeStart', function() {
        User.getUsers().then(function(data) {
        if(data.data.success){
            if(data.data.usertype === 'admin') {
                user.users = data.data.users;
            }
        }
        });
        User.getAllUsers().then(function(data) {
        if(data.data.success){
                user.users = data.data.users; 
                console.log(data);  
        }
        });

        User.getAllComplaints().then(function(data){
            var result = data.data.data;
            user.complaints = [];
            if(data.data.success){
                for(var i = 0; i < result.length; i++){
                    user.complaints.push(result[i]);
                }
            }
            
        });
        
    });
    
//    User.getAllGames().then(function(data) {
//        console.log(data);
//        if(data.data.success){
//            $scope.data =  {
//                availablegames:data.data.games                
//            };
//        }
//    });
    
//    $scope.sendRequest = function(gameId,pilotplayerfee,goal){
//        var requestObject = {};
//        
//        requestObject.pilotseekerId  = user.id;
//        requestObject.pilotplayerId  = $routeParams.id;
//        requestObject.gameId         = $scope.gameId;
//        requestObject.pilotplayerfee = $scope.pilotplayerfee;
//        requestObject.goal           = $scope.goal;
//        console.log(requestObject.pilotplayerfee);
//        
//    };
    
//     User.getUserGames().then(function(data) {
//        console.log(data);
//    });

    
})

.controller('editCtrl', function(Auth, AuthToken, User, $scope, $routeParams, $route, $location, $timeout) {
    
    var user = this;
    
    User.getUser($routeParams.id).then(function(data) {
        console.log(data);
        user.currentUser   = data.data.user._id;
        $scope.newUsername = data.data.user.username;
        $scope.newAddress  = data.data.user.address;
        $scope.newAge      = data.data.user.age;
        $scope.newStatus   = data.data.user.status;
    });
    
    this.updateName = function(newUsername, newAddress, newAge, newStatus) {
        
        console.log('submit');
        var userObject = {};
        
        userObject._id      = user.currentUser;
        userObject.username = $scope.newUsername;
        userObject.address  = $scope.newAddress;
        userObject.age      = $scope.newAge;
        userObject.status   = $scope.newStatus;
        
        
        User.editUser(userObject).then(function(data){
            console.log(data);
        });
        
        Auth.renewSession(userObject._id).then(function(data) {
            AuthToken.setToken(data.data.token);
            $route.reload();
        });
    };

    $scope.deactivateModal = function() {
        showDeactivateModal();
        $scope.message = "Do you want to Deactivate your account? ";
    }
    
    // $scope.hideDeactivateModal = function() {
    //     hideDeactivateModal();
    // }

    $scope.deactivate = function() {
        User.deactivateAccount($routeParams.id).then(function(data){
            if(data.data.success){
                hideDeactivlateModa();
                $timeout(function() {
                    Auth.logout();
                    $location.path('/login');
                 }, 300);
            } 
        });
    }
   
    var showDeactivateModal = function() {
        $("#showDeactivateModal").modal({backdrop: "static"});
    }

    var hideDeactivlateModa = function() {
        $("#showDeactivateModal").modal('hide');
    };

    var showActivateModal = function() {
        $("#activateModal").modal({backdrop: "static"});
    }
    
    var hideActivateModal = function() {
        $("#activateModal").modal('hide');
    }
    showActivateModal();
    this.renewSession = function() {
        user.choice = true;
        Auth.renewSession(user.id).then(function(data) {
                console.log(data);
                AuthToken.setToken(data.data.token);
                user.checkSession();
        });
        hideModal();
    };

})

.controller('uploadCtrl', function(User, $scope, uploadFile, $timeout, $route, $rootScope) {
    var upload = this;
    
    
         User.getAllGames().then(function(data) {
            console.log(data);
            if(data.data.success){
                upload.games = data.data.games;
            }
        });
        

    $scope.Submit = function(gameName, minimumFee, maximumFee, minimumLevel, maximumLevel, yearCreated, yearPresent) {
        var imageObject = {};
        
        imageObject.file         = $scope.file;
        imageObject.gamename     = $scope.gameName;
        imageObject.minimumfee   = $scope.minimumFee;
        imageObject.maximumfee   = $scope.maximumFee;
        imageObject.minimumlevel = $scope.minimumLevel;
        imageObject.maximumlevel = $scope.maximumLevel;
        imageObject.yearcreated  = $scope.yearCreated;
        imageObject.yearpresent  = $scope.yearPresent;
        
        $scope.uploading = true;
        uploadFile.upload(imageObject).then(function(data) {
            if (data.data.success) {
                $scope.uploading = false;
                $scope.alert = 'alert alert-success';
                $scope.message = data.data.message;
                $scope.file = {};
            } else {
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message = data.data.message;
                $scope.file = {};
            }
        });
    };

    $scope.photoChanged = function(files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };
    
    this.addGames = function() {
        showUploadModal();
    }
    
    this.Cancel = function() {
        hideUploadModal();
    }
    
    var showUploadModal = function() {   
        
        upload.modalHeader = 'Upload Games';
        $("#uploadModal").modal({backdrop: "static"});
    };
    
    var hideUploadModal = function() {
        $("#uploadModal").modal('hide');
    };

});

