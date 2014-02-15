'use strict';

var controllers = angular.module('app.controllers', []);

controllers.controller('HomeCtrl', ['$scope', 'profile', function ($scope, profile) {
  $scope.profile = profile;
}]);

controllers.controller('SettingsCtrl', ['$scope', 'Settings', function ($scope, Settings) {
  $scope.settings = Settings.read() || {
    level: 'easy',
    scene: 'desert',
    character: 'professor',
    currentView: 'level',
    currentPage: 'templates/settings/level.tpl.html'
  };
  $scope.navigate = function(item) {
    var settings = $scope.settings;
    settings.currentView = item;
    settings.currentPage = 'templates/settings/' + item + '.tpl.html'
    Settings.write(settings);
  };
  $scope.select = function(item) {
    var settings = $scope.settings;
    settings[settings.currentView] = item;
    Settings.write(settings);
  };
}]);

controllers.controller('GameCtrl', [
  '$scope', 'Swipe', 'BGM', '$rootScope', '$location', 
  function ($scope, Swipe, BGM, $rootScope, $location) {

  var swipe = Swipe,
      bgm = BGM,
      needTerm = false;

  $scope.init = function(swf) {

    swipe.onLeft = function () {
      swf.SetVariable('direction', 'left');
    };
    swipe.onRight = function () {
      swf.SetVariable('direction', 'right');
    };
    swipe.onTap = function () {
      swf.SetVariable('state', 'fire');
    };
    swipe.enable();
    bgm.play();
    needTerm = true;
  };

  $scope.$on('$locationChangeStart', function (event, next, current) {
    if (needTerm) {
      swipe.disable();
      bgm.stop();
    }
  });
}]);
