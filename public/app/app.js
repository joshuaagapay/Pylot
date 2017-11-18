angular.module('pylotApp', ['appRoutes', 'acntControllers', 'portfolioControllers', 'transactionControllers', 'monitoringControllers', 'authServices', 'fbControllers'])
.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
