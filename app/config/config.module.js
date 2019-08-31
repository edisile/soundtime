import angular from 'angular';
import apiConstants from './api.constants';

let configModule = angular.module('app.config', []);

configModule.constant('apiConstants', apiConstants);

export default configModule;
