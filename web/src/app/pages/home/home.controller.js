(function () {
    'use strict';

    angular.module('BlurAdmin.pages.home')
        .filter('split', function () {
            return function (input, splitChar, splitIndex) {
                // do some bounds checking here to ensure it has that index
                return input.split(splitChar)[splitIndex];
            };
        })
        .controller('HomeCtrl', HomeCtrl);
    /** @ngInject */
    function HomeCtrl($http, $scope, printService, $state, interns, tasks) {

        $scope.user = {};
        $scope.tabs = interns;
        $scope.tasks = tasks;

        console.log(tasks);


        $scope.navigationCollapsed = true;
        $scope.showCompose = function (subject, to, text) {
            composeModal.open({
                subject: subject,
                to: to,
                text: text
            });
        };

        $scope.getUserProfile = function (key) {
            $scope.user = $scope.tabs[key];
            if ($scope.user.tasks && $scope.user.tasks[0]) {
                $scope.user.unassignedTasks = []
                $scope.tasks.forEach(function (task, key) {
                    var isAssigned = false;
                    $scope.user.tasks.forEach(function (assignedTask, asKey) {
                        if (assignedTask.id === task.id) {
                            isAssigned = true;
                        }
                    })
                    if (!isAssigned) {
                        $scope.user.unassignedTasks.push(task);
                    }
                })
            } else {
                $scope.user.unassignedTasks = $scope.tasks;
            }

            $state.go('dashboard.home.user');
        };

        $scope.assignTaskToUser = function (userId, taskId) {
            console.log(userId + " " + taskId);
            $scope.tasks.forEach(function (task, key) {
                if (task.id === taskId) {
                    $scope.tasks[key].status = 'ToDo';
                }
            })

            //$state.go('dashboard.home.user');
        };

        $state.transitionTo('dashboard.home.users');
        internsTimeline($scope.tabs);
    }

    function internsTimeline(interns) {

        var container = document.getElementsByClassName('js-visualization')[0];

        var data = [];
        angular.forEach(interns, function (item) {
            // temp solution for error of startdate doesn't exist.
            if (item.startdate) {
                data.push({
                    id: item.id,
                    content: item.firstname,
                    start: item.startdate,
                    end: item.enddate
                });

            }
        });
        // Create a DataSet (allows two way data-binding)
        var items = new vis.DataSet(data);

        // Configuration for the Timeline
        var options = {};

        // Create a Timeline
        var timeline = new vis.Timeline(container, items, options);
    }

})();
