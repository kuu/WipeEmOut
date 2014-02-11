'use strict';

angular.module('app', [
  'app.services',
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
        templateUrl:'templates/home.tpl.html'
      }).when('/settings', {
        controller: 'SettingsCtrl',
        /*
        resolve: {
          settings: ['Settings', function(Settings) {
            return Settings.read();
          }]
        },
        */
        templateUrl:'templates/settings.tpl.html'
      }).when('/game', {
        controller: 'GameCtrl',
        /*
        resolve: {
          data: ['GameLoader', 'SettingsLoader', function(GameLoader, SettingsLoader) {
            return GameLoader(SettingsLoader());
          }]
        },
        */
        templateUrl:'templates/game.tpl.html'
      }).otherwise({
        redirectTo:'/'
      });
  }]);
