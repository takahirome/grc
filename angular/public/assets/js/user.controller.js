angular
    .module('app')
    .controller('UserCtrl',UserCtrl);

    UserCtrl.$inject = ['$scope', '$http'];

    function UserCtrl($scope, $http){
        var vm = this;
        var url = '/user';

        $scope.getUser = function() {
            $http({
                method: 'GET',
                url:url+'/?email='+$scope.email
            }).then(function onSuccess(response) {
                //通信に成功
                console.log(response.data);
                $scope.items = response.data;
            }, function onError(response) {
                //通信に失敗
                console.log(response);
            });
        };

        $scope.saveUser = function() {
            var param = {};
            param.email = $scope.email;
            param.password = $scope.password;
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

        $scope.deleteUser = function() {
            var param = {};
            param.email = $scope.email;
            console.log(param);

            $http({
                method: 'POST',
                url:'/deleteuser',
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