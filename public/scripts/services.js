'use strict';

var services = angular.module('app.services', []);

services.factory('Settings', function () {
  return {
    write: function (settings) {
      localStorage.setItem('settings', angular.toJson(settings));
    },
    read: function () {
      return angular.fromJson(localStorage.getItem('settings'));
    }
  };
});

services.factory('Swipe', function () {
  var swipe = false, prev, total, first,
      startTouch = function(e) {
        e.preventDefault();
        swipe = true;
        prev = 0;
        total = 0;
        first = true;
      },
      endTouch = function(e) {
        if (swipe) {
          if (Math.abs(total) > 10) {
            // Swipe
            if (total < 0) {
              self.onLeft();
            } else {
              self.onRight();
            }
          } else {
            // Tap
            self.onTap();
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

  var self = {
    onLeft: null,
    onRight: null,
    onTap: null,
    enable: function() {
      document.addEventListener('touchstart', startTouch, false);
      document.addEventListener('mousedown', startTouch, false);
      document.addEventListener('touchend', endTouch, false);
      document.addEventListener('mouseup', endTouch, false);
      document.addEventListener('touchmove', moveTouch, false);
      document.addEventListener('mousemove', moveTouch, false);
    },
    disable: function () {
      document.removeEventListener('touchstart', startTouch, false);
      document.removeEventListener('mousedown', startTouch, false);
      document.removeEventListener('touchend', endTouch, false);
      document.removeEventListener('mouseup', endTouch, false);
      document.removeEventListener('touchmove', moveTouch, false);
      document.removeEventListener('mousemove', moveTouch, false);
      self.onLeft = null;
      self.onRight = null;
      self.onTap = null;
    }
  };
  return self;
});

services.factory('BGM', function () {
  var audio, state = 'ready';

  var self = {
    play: function () {
      if (state === 'playing') {
        ;
      } else if (state === 'pausing') {
        audio.play();
        state = 'playing';
      } else if (state === 'ready') {
        window.bgmAudio = audio = new Audio(),
        audio.src = "assets/bgm.mp3";
        audio.addEventListener('canplay', function () {
          audio.currentTime = 5.5;
          audio.volume = 0.5;
          audio.loop = true;
          audio.play();
          state = 'playing';
        }, false);
        document.addEventListener('touchstart', function loadAudio() {
          document.removeEventListener('touchstart', loadAudio, false);
          audio.load();
        }, false);
      }
    },
    pause: function () {
      if (state === 'playing') {
        audio.pause();
        state = 'pausing';
      }
    },
    stop: function () {
      self.pause();
      state = 'ready';
      window.bgmAudio = audio = null;
    }
  };
  return self;
});
