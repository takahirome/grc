angular
    .module('app')
    .controller('StockCtrl',StockCtrl);

    StockCtrl.$inject = ['$scope', '$http'];

    function StockCtrl($scope, $http){
        var vm = this;
        var url = '/stock';

        $scope.getStock = function() {
            $http({
                method: 'GET',
                url:url+'/?userid='+$scope.userid
            }).then(function onSuccess(response) {
                //通信に成功
                console.log(response.data);
                $scope.items = response.data;
            }, function onError(response) {
                //通信に失敗
                console.log(response);
            });
        };

        $scope.getStockAll = function() {
            $http({
                method: 'GET',
                url:'/stocks'
            }).then(function onSuccess(response) {
                //通信に成功
                console.log(response.data);
                $scope.items = response.data;
            }, function onError(response) {
                //通信に失敗
                console.log(response);
            });
        };
        

        $scope.saveStock = function() {
            var param = {};
            param.userid = $scope.userid;
            param.domain = $scope.domain;
            param.keyword = $scope.keyword;
            console.log(param);

            $http({
                method: 'POST',
                url:url,
                data:param
            }).then(function onSuccess(response) {
                //通信に成功
                console.log(response.status);
            }, function onError(response) {
                //通信に失敗
                console.log(response.status);
            });
        };

        $scope.deleteStock = function() {
            var param = {};
            param.userid = $scope.userid;
            param.domain = $scope.domain;
            param.keyword = $scope.keyword;
            console.log(param);

            $http({
                method: 'POST',
                url:'/deletestock',
                data:param
            }).then(function onSuccess(response) {
                //通信に成功
                console.log(response.status);
            }, function onError(response) {
                //通信に失敗
                console.log(response.status);
            });
        };
    };