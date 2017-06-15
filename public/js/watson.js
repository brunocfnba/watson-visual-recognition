var watsonModule = angular.module('watsonModule',[]);

// Factory to access backend APIs
      watsonModule.factory('watsonVr', function($http){
        
        function classify(jsonInfo,callback,failure){
            $http({
              method: 'POST',
              url: '/classify',
              data: jsonInfo
            }).then(callback, failure);
          }

        return {
          watsonClassify: classify
        };
      });