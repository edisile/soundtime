import apiConstants from './api.constant';
import websiteNameConstant from './websiteName.constant';

let configModule = angular.module('app.config', []);

configModule.constant('apiConstants', apiConstants);
configModule.constant('websiteNameConstant', websiteNameConstant);

export default configModule;