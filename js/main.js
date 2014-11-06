angular
    .module('site', [])
    .factory('Backend', ['$http',
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
                projects: get('https://api.github.com/orgs/microsoft/repos'),
                orgs: get('data/organization.json')
            }
        }
    ])
    .controller('MainCtrl', ['Backend',
        function(Backend) {
            var self = this;
            Backend.orgs().then(function(data) {
                self.orgs = data;
            });

            Backend.projects().then(function(data) {
                self.projects = data;
            }).then(function(){
                return Backend.featured();
            }).then(function(data){
                self.featured = data;
            });
        }
    ])