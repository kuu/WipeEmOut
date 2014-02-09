'use strict';

angular.module('app', [
  'app.controllers',
  'app.directives',
  'ngRoute'
  ]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        /*
        controller: 'HomeCtrl',
        resolve: {
          recipes: ["ProfileLoader", function(ProfileLoader) {
            return ProfileLoader();
          }]
        },
        */
        templateUrl:'htmls/home.tpl.html'
      }).when('/settings', {
        controller: 'SettingsCtrl',
        /*
        resolve: {
          recipe: ['SettingsLoader', function(SettingsLoader) {
            return SettingsLoader();
          }]
        },
        */
        templateUrl:'htmls/settings.tpl.html'
      }).when('/game', {
        controller: 'GameCtrl',
        /*
        resolve: {
          data: ['GameLoader', 'SettingsLoader', function(GameLoader, SettingsLoader) {
            return GameLoader(SettingsLoader());
          }]
        },
        */
        templateUrl:'htmls/game.tpl.html'
      }).otherwise({
        redirectTo:'/'
      });
  }]);
