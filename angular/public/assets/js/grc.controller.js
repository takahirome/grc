angular
    .module('app')
    .controller('FooCtrl',FooCtrl);

    function FooCtrl(){
        var vm = this;

        vm.name = "Taro";
        vm.setName = function(){
            vm.name = "Jiro";
        };
    };
