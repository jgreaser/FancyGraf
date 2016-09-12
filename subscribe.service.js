angular
    .module('app')
    .factory('mailService', mailService);

mailService.$inject = ['$http'];

function mailService($http) {
  
    var subscribed = false;

    var service = {
        subscribe: subscribe,
        getSubscribedStatus: getSubscribedStatus
    };

    return service;

    function subscribe(first, last, email) {
        $http.get("https://reinvention.flvs.net/fancygraf/php/mailto.php?&first=" + first + "&last=" + last + "&email=" + email)
            .then(function(response) {
            console.log(response);
            subscribed = true;

            }, function errorCallback(response) {
            console.log(response);
            subscribed = false;
            });

    };

    function getSubscribedStatus (){
        return subscribed;
    }
}