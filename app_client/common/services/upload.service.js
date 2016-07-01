(function(){
  angular
    .module('PortfolioSPAModule')
    .service('UploadService', UploadService);

    UploadService.$inject = ['$http', 'AuthentictionService'];
    function UploadService($http, AuthentictionService){
      service = this;

      service.uploadImage = function(fileData, successCB, errorCB){

        var fd = new FormData();
        fd.append('file', fileData);
        $http.post("/api/upload", fd, {
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined,
              Authorization: 'Bearer ' + AuthentictionService.getToken()
            }
        })
        .success(function(response){
          successCB(response);
        })
        .error(function(response){
          errorCB(response);
        });
      };

    }
})();
