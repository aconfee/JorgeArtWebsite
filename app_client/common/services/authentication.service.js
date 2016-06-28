(function(){
  angular
    .module('PortfolioSPAModule')
    .service('authentication', authentication);

    authentication.$inject = ['$window', '$http'];
    function authentication($window, $http){
      var saveToken = function(token){
        $window.localStorage['admin-token'] = token;
      };

      var getToken = function(){
        return $window.localStorage['admin-token'];
      };

      var login = function(user){
        return $http.post('/api/login', user).success(function(data){
          saveToken(data.token);
        });
      };

      var logout = function(){
        $window.localStorage.removeItem('admin-token');
      };

      var isLoggedIn = function(){
        var token = getToken();

        if(token){
          var payload = JSON.parse($window.atob(token.split('.')[1]));

          return payload.exp > Date.now() / 1000;
        }
        else{
          return false;
        }
      };

      var currentUser = function(){
        if(isLoggedIn()){
          var token = getToken();
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return {
            username: payload.username
          };
        }
      };

      return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        saveToken: saveToken,
        getToken: getToken
      };
    }
})();
