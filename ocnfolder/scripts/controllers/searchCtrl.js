var app = angular.module('onctoolsSearchApp');

app.controller('SearchCtrl', function($scope, $http) {
    $http.get('books.json').then(function(result) {
        $scope.contents = result.data;
        $scope.indent = 0;
    });
});