'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function ($scope) {
        $scope.startTime = localStorage.getItem('startTime');
        if ($scope.startTime == null) {
            $scope.startTime = '9:00';
        }
        $scope.export = '';
        $scope.save = function () {
            localStorage.setItem('timeslots', JSON.stringify($scope.timeslots));
            localStorage.setItem('backlog', JSON.stringify($scope.backlog));
            $scope.export = '';
            for (var i in $scope.timeslots) {
                if (!$scope.timeslots.hasOwnProperty(i)) {
                    continue;
                }
                var s = $scope.timeslots[i];
                $scope.export += s.time.getHours() + ':' + s.time.getMinutes() + ' [' + (s.completed ? 'x' : ' ') + '] ' + s.item + '\n';
            }
        };
        $scope.addToDay = function (item) {
            $scope.addToSlot(item);
            $scope.redoTimes();
            $scope.backlog.splice($scope.backlog.indexOf(item), 1);
        };
        $scope.removeItem = function (item) {
            $scope.backlog.splice($scope.backlog.indexOf(item), 1);
        };
        $scope.moveToBacklog = function (slot) {
            $scope.backlog.push(slot.item);
            $scope.timeslots.splice($scope.timeslots.indexOf(slot), 1);
            $scope.redoTimes();
        };
        $scope.duplicate = function (slot) {
            $scope.addToSlot(slot.item);
            $scope.redoTimes();
        };
        $scope.startHour = function () {
            return $scope.startTime.split(':')[0];
        };
        $scope.startMinute = function () {
            return $scope.startTime.split(':')[1];
        };
        $scope.newDay = function() {
            if(confirm('This will clear all completed tasks and reset times for non-completed tasks. Are you sure?')) {
                for (var i = 0; i < $scope.timeslots.length;) {
                    if (!$scope.timeslots.hasOwnProperty(i)) {
                        continue;
                    }
                    var s = $scope.timeslots[i];
                    if (s.completed) {
                        $scope.timeslots.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                $scope.redoTimes();
            }
        };
        $scope.redoTimes = function () {
            var startTime = new Date();
            startTime.setHours($scope.startHour(), $scope.startMinute(), 0);
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

        $scope.$watchCollection('backlog', $scope.save);
        $scope.$watchCollection('timeslots', $scope.save);
        $scope.$watch('startTime', function () {
            if (!$scope.startTime.match(/[0-9]{1,2}:[0-9]{2}/)) {
                $scope.startTime = '9:00';
            }
            localStorage.setItem('startTime', $scope.startTime);
            $scope.redoTimes();
        });
    }]);