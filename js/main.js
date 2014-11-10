var app = angular.module('site', ['ui.bootstrap']);

app.factory('Backend', ['$http',
    function($http) {
        var get = function(url) {
            return function() {
                return $http.get(url).then(function(resp) {
                    return resp.data;
                });
            }
        };

        return {
            featured: get('data/featured.json'),
            projects: get('https://api.github.com/orgs/microsoft/repos?per_page=100'),
            orgs: get('data/organization.json')
        }
    }
])
.controller('MainCtrl', ['Backend', '$scope', 'filterFilter', 
    function(Backend, $scope, filterFilter) {
        var self = this;
        Backend.orgs().then(function(data) {
            self.orgs = data;
        });

        Backend.projects().then(function(data) {
            self.projects = data;
            
            $scope.currentPage = 1; //current page
            $scope.maxSize = 5; //pagination max size
            $scope.entryLimit = 12; //max rows for data table

            /* init pagination with $scope.list */
            $scope.noOfPages = Math.ceil(self.projects.length / $scope.entryLimit);
            
            $scope.$watch('searchText', function(term) {
                // Create $scope.filtered and then calculate $scope.noOfPages, no racing!
                $scope.filtered = filterFilter(self.projects, term);
                $scope.noOfPages = Math.ceil($scope.filtered.length / $scope.entryLimit);
            });
        }).then(function(){
            return Backend.featured();
        }).then(function(data){
            self.featured = data;
            self.featuredProjects = new Array();
            
            self.featured.forEach(function (name) {
                for (var i = 0; i < self.projects.length; i++) {
                    var project = self.projects[i];
                    if (project.name == name) {
                        self.featuredProjects.push(project);
                        return;
                    }
                }
             });
        });
    }
]);
    
app.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});