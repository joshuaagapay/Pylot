angular.module('uploadFileService', [])

.service('uploadFile', function($http) {
    this.upload = function(imageObject) {
        var fd = new FormData();
        fd.append('myfile', imageObject.file.upload);
        fd.append('gamename', imageObject.gamename);
        fd.append('minimumfee', imageObject.minimumfee);
        fd.append('maximumfee', imageObject.maximumfee);
        fd.append('minimumlevel', imageObject.minimumlevel);
        fd.append('maximumlevel', imageObject.maximumlevel);
        fd.append('yearcreated', imageObject.yearcreated);
        fd.append('yearpresent', imageObject.yearpresent);
     
        return $http.post('/api/upload/', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

});
