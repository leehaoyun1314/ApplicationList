angular.module('appCtrl.services', []).factory('Logger', ['$rootScope', function($rootScope) {
    $rootScope.logs = [];
    return {
        add: function(content) {
            $rootScope.logs.push({
                content: content,
                time: new Date().toLocaleString()
            });
        },
        clear: function() {
            $rootScope.logs = [];
        }
    };
}]);
