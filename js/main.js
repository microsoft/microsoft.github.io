var app = angular.module('site', ['ui.bootstrap', 'ngAria']);

app.factory('Backend', ['$http',
    function($http) {
        var get = function(url) {
            return function() {
                return $http.get(url).then(function(resp) {
                    return resp.data;
                });
            };
        };

        return {
            featured: get('data/featured.json'),
            orgs: get('data/organization.json')
        };
    }
])
.controller('MainCtrl', ['Backend', '$scope', 'filterFilter', '$anchorScroll',
    function(Backend, $scope, filterFilter, $anchorScroll) {
        var self = this;

        Backend.orgs().then(function(data) {
            self.orgs = data;
        });

        Backend.featured().then(function(data) {
            self.featured = data;

            $.ajax({
                url: 'https://popularrepostg.blob.core.windows.net/popularrepos/projects.json',
                dataType: 'jsonp',
                jsonpCallback: 'JSON_CALLBACK',
                success: function(data) {
                    var projects = data[0].AllProjects;
                    $scope.currentPage = 1; //current page
                    $scope.maxSize = 5; //pagination max size
                    $scope.entryLimit = 36; //max rows for data table

                    /* init pagination with $scope.list */
                    $scope.noOfRepos = projects.length;
                    $scope.noOfPages = Math.ceil($scope.noOfRepos / $scope.entryLimit);
                    $scope.resultsSectionTitle = 'All Repos';
                    $scope.pageChanged = function() {
                        $anchorScroll();
                    };
                    
                    $scope.$watch('searchText', function(term) {
                        // Create $scope.filtered and then calculate $scope.noOfPages, no racing!
                        $scope.filtered = filterFilter(projects, term);
                        $scope.noOfRepos = $scope.filtered.length;
                        $scope.noOfPages = Math.ceil($scope.noOfRepos / $scope.entryLimit);
                        $scope.resultsSectionTitle = (!term) ? 'All Repos' : (($scope.noOfRepos === 0) ? 'Search results' : ($scope.noOfRepos + ' repositories found'));
                    });

                    var featuredProjects = new Array();

                    self.featured.forEach(function (name) {
                        for (var i = 0; i < projects.length; i++) {
                            var project = projects[i];
                            if (project.Name == name) {
                                featuredProjects.push(project);
                                return;
                            }
                        }
                    });

                    self.projects = projects;
                    self.featuredProjects = featuredProjects;
                    $scope.$apply();
                }
            });
            $.ajax({
                url: 'https://popularrepostg.blob.core.windows.net/popularrepos/projectssummary.json',
                dataType: 'jsonp',
                jsonpCallback: 'JSON_CALLBACK',
                success: function (stats) {
                    if (stats !== null) {
                        $scope.overAllStats = stats[0];
                    }
                }
            });
        });
    }
])
.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    };
});