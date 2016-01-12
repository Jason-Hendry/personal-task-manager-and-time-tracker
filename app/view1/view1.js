'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function ($scope) {

        $scope.save = function () {
            localStorage.setItem('timeslots', JSON.stringify($scope.timeslots));
            localStorage.setItem('backlog', JSON.stringify($scope.backlog));
        };
        $scope.addToDay = function (item) {
            $scope.addToSlot(item);
            $scope.redoTimes();
            $scope.backlog.splice($scope.backlog.indexOf(item), 1);
        };
        $scope.removeItem = function(item) {
            $scope.backlog.splice($scope.backlog.indexOf(item), 1);
        };
        $scope.moveToBacklog = function (slot) {
            $scope.backlog.push(slot.item);
            $scope.timeslots.splice($scope.timeslots.indexOf(slot), 1);
            $scope.redoTimes();
        };
        $scope.redoTimes = function () {
            var startTime = new Date();
            startTime.setHours(9, 0, 0);
            for (var i in $scope.timeslots) {
                if (!$scope.timeslots.hasOwnProperty(i)) {
                    continue;
                }
                $scope.timeslots[i].time = startTime;
                startTime = new Date(startTime.getTime() + 30 * 60000);
            }
        };
        $scope.sortableOptions = {
            stop: function (e, ui) {
                $scope.redoTimes();
            }
        };
        $scope.addToSlot = function (item) {
            $scope.timeslots.push({item: item, time: null, completed: false});
            $scope.redoTimes();
        };
        $scope.addToBacklog = function (item) {
            $scope.backlog.push(item);
        };

        var ts = localStorage.getItem('timeslots');
        if (ts) {
            try {
                $scope.timeslots = JSON.parse(ts);
            } catch (e) {
                $scope.timeslots = [];
            }
        } else {
            $scope.timeslots = [];
        }
        $scope.redoTimes();
        var bl = localStorage.getItem('backlog');
        if (bl) {
            try {
                $scope.backlog = JSON.parse(bl);
            } catch (e) {
                $scope.backlog = [];
            }
        } else {
            $scope.backlog = [];
        }
        $scope.redoTimes();

        $scope.$watchCollection('backlog',$scope.save);
        $scope.$watchCollection('timeslots',$scope.save);

    }]);