(function(){

  angular
    .module('PortfolioSPAModule')
    .service('ResponsiveService', ResponsiveService);

  ResponsiveService.$inject = ['$window'];
  function ResponsiveService($window){
    var service = this;

    var smallScreenMax = 900;
    var mediumScreenMax = 1500;

    ///
    /// Get the number of projects we want to show in a row based on how
    /// big the screen is.
    ///
    service.GetHomePageRowSize = function(){
      console.log("getting home page row size");
      var rowSize = 1;

      if($window.innerWidth > smallScreenMax){
        rowSize = 2;
      }

      if($window.innerWidth > mediumScreenMax){
        rowSize = 3;
      }

      return rowSize;
    };
  }

})();
