angular
    .module('app')
    .controller('subscribeController', subscribeController);

subscribeController.$inject = ['$rootScope', '$scope', '$element',  '$compile', 'mailService'];

function subscribeController($rootscope, $scope, $element,  $compile, mailService) {

    var vm = this;
    vm.hide = false;
    vm.firstName = 'First';
    vm.lastName = 'Last';
    vm.email = 'email';

    vm.subscribed = false;
    vm.processing = false;
    vm.subscribe = subscribe;

    $scope.$watch(mailService.getSubscribedStatus, function(newValue, oldValue) {
          vm.subscribed = mailService.getSubscribedStatus();
          vm.processing = false;
        });

    function subscribe (first, last, email){

        console.log("SUBSCRIBE! (controller)");
        vm.processing = true;
        mailService.subscribe(first, last, email);
    }
}