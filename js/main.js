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
                projects: get('https://api.github.com/orgs/microsoft/repos?per_page=100'),
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

                FV.FlipView.featured = new WinJS.Binding.List(self.featuredProjects);
                FV.FlipView.init();
            });
        }
    ]);

WinJS.Namespace.define("FV.FlipView", {
    init: function () {
        return WinJS.UI.processAll().then(function () {
            return WinJS.Binding.processAll(null, FV.FlipView).then(function () {
                var fv = document.querySelector(".win-flipview");
                if (fv && fv.winControl) {
                    FV.FlipView.fv = fv.winControl;
                    WinJS.Promise.timeout().then(function () {
                        fv.winControl.forceLayout();
                    });
                }
            })
        })
    },

    flip: WinJS.UI.eventHandler(function (ev) {
        var fv = FV.FlipView.fv;
        if (FV.FlipView.p !== null) {
            FV.FlipView.p.cancel();
        }
        FV.FlipView.p = WinJS.Promise.timeout(5000).then(function () {
            fv.count().then(function (count) {
                if (fv.currentPage === count - 1) {
                    FV.FlipView.p = null;
                    fv.currentPage = 0;
                } else {
                    fv.next().then(function () {
                        FV.FlipView.p = null;
                    })
                }
            });
        })
    }),
    p: null,
    fv: null,
    featured: null
});