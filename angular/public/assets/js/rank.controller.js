angular
    .module('app')
    .controller('RankCtrl',RankCtrl);

    RankCtrl.$inject = ['$scope', '$http'];

    function RankCtrl($scope, $http){
        var vm = this;
        var url = '/rank';

        $scope.getRank = function() {
            $http({
                method: 'GET',
                url:url+'/?domain='+$scope.domain+'&keyword='+$scope.keyword
            }).then(function onSuccess(response) {
                //通信に成功
                console.log(response.data);
                $scope.items = response.data;
            }, function onError(response) {
                //通信に失敗
                console.log(response);
            });
        };

        $scope.getRankAll = function() {
            $http({
                method: 'GET',
                url:'/ranks'
            }).then(function onSuccess(response) {
                //通信に成功
                console.log(response.data);
                $scope.items = response.data;
            }, function onError(response) {
                //通信に失敗
                console.log(response);
            });
        };
        

    };