import angular from 'angular';
import homeController from './home.controller';

let homeModule = angular.module('app.home', ['app.common']);

homeModule.controller(homeController);