import angular from 'angular';
// Components
import navbarComponent from './components/navbar/navbar.component'
import uploaderComponent from './components/uploader/uploader.component'
// Services
import colorService from './services/color.service';
import playerService from './services/player.service';

let commonModule = angular.module('app.common', []);

commonModule.component('navbar', navbarComponent);
commonModule.component('uploader', uploaderComponent);

commonModule.service('colorService', colorService);
commonModule.service('playerService', playerService);

export default commonModule;
