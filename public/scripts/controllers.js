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
  '$scope', 'Swipe', 'BGM', function ($scope, Swipe, BGM) {

  var swipe = Swipe,
      bgm = BGM,
      needTerm = false,
      player = null;

  $scope.init = function(swf) {

    window.swfPlayer = player = swf;
    window.swipeObject = swipe;
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

  $scope.$on('$locationChangeStart', function () {
    if (needTerm) {
      swipe.disable();
      bgm.stop();
      needTerm = false;
      player.pause();
      player = null;
      delete window.swfPlayer;
      delete window.swipeObject;
    }
  });
}]);

controllers.controller('AutoPlayCtrl', [
  '$scope', 'BGM', function ($scope, BGM) {

  var bgm = BGM,
      needTerm = false;

  $scope.options = {
    rootVars: {'autoplay': true}
  };
  $scope.init = function() {
    bgm.play();
    needTerm = true;
  };

  $scope.$on('$locationChangeStart', function () {
    if (needTerm) {
      bgm.stop();
      needTerm = false;
    }
  });
}]);
