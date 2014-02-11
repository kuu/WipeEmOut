'use strict';

var services = angular.module('app.services', []);

services.factory('Settings', ['$rootScope', function ($rootScope) {
  return {
    write: function (settings) {
      localStorage.setItem('settings', angular.toJson(settings));
    },
    read: function () {
      return angular.fromJson(localStorage.getItem('settings'));
    }
  };
}]);
