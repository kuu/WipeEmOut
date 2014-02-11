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

controllers.controller('GameCtrl', ['$scope', function ($scope) {
  $scope.init = function(swf) {
    var swipe = false, prev, total, first, audio, playback = false, dir,
        startTouch = function(e) {
          e.preventDefault();
          dir = '';
          swipe = true;
          prev = 0;
          total = 0;
          first = true;
          if (!playback) {
            audio.play();
          }
        },
        endTouch = function(e) {
          var dir;

          if (swipe) {
            if (Math.abs(total) > 10) {
              // Swipe
              dir = total < 0 ? 'left' : 'right';
              swf.SetVariable('direction', dir);
            } else {
              // Tap
              swf.SetVariable('state', 'fire');
            }
            swipe = false;
          }
        },
        moveTouch = function(e) {
          var touches, x;

          if (swipe) {
            if (touches = e.touches) {
              // touchmove
              if (first) {
                prev = touches[0].pageX;
                first = false;
              } else {
                total += (touches[0].pageX - prev);
              }
            } else {
              // mousemove
              if (first) {
                prev = e.x;
                first = false;
              } else {
                total += (e.x - prev);
              }
            }
          }
        };

    document.addEventListener('touchstart', startTouch, false);
    document.addEventListener('mousedown', startTouch, false);
    document.addEventListener('touchend', endTouch, false);
    document.addEventListener('mouseup', endTouch, false);
    document.addEventListener('touchmove', moveTouch, false);
    document.addEventListener('mousemove', moveTouch, false);

    audio = new Audio();
    audio.src = "assets/bgm.mp3";
    audio.addEventListener('canplay', function () {
      audio.currentTime = 5.5;
      audio.volume = 0.5;
      audio.loop = true;
    }, false);
  };
}]);
