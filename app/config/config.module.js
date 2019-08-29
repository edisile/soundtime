import angular from 'angular';
import apiConstant from './api.constant';

let configModule = angular.module('app.config', []);

configModule.constant('api', apiConstant);

export default configModule;
