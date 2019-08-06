import angular from 'angular';
// Components
import navbarComponent from './components/navbar/navbar.component';
import uploaderComponent from './components/uploader/uploader.component';
// Directives
import colorWatchDirective from './directives/colorWatch/colorWatch.directive';
// Services
import colorService from './services/color.service';
import playerService from './services/player.service';

let commonModule = angular.module('app.common', ['msl.uploads']);

commonModule.component('navbar', navbarComponent);
commonModule.component('uploader', uploaderComponent);

commonModule.directive('colorWatch', colorWatchDirective);

commonModule.service('colorService', colorService);
commonModule.service('playerService', playerService);

export default commonModule;
