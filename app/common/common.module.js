// Components
import navbarComponent from './components/navbar/navbar.component';
import uploaderComponent from './components/uploader/uploader.component';
// Directives
import colorWatchDirective from './directives/colorWatch/colorWatch.directive';
import featherDirective from './directives/feather/feather.directive';
// Filters
import fileSizeFilter from './filters/fileSize.filter';
// Services
import uploadService from './services/upload.service';
import apiUrlBuilderService from './services/apiUrlBuilder.service';

let commonModule = angular.module('app.common', ['app.config', 'msl.uploads']);

commonModule.component('navbar', navbarComponent);
commonModule.component('uploader', uploaderComponent);

commonModule.directive('colorWatch', colorWatchDirective);
commonModule.directive('feather', featherDirective);

commonModule.filter('fileSizeFilter', fileSizeFilter);

commonModule.service('apiUrlBuilderService', apiUrlBuilderService);
commonModule.service('uploadService', uploadService);

export default commonModule;