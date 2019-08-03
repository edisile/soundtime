// Angular
import angular from 'angular';
import ngRoute from 'angular-route';

// Libraries
	// Drag and drop file upload
import dropzone from '../node_modules/dropzone/dist/dropzone';
import ngDropzone from '../node_modules/ngdropzone/dist/ng-dropzone.min';
	// On scroll events
import scrollWatch from '../node_modules/angular-scroll-watch/build/angular-scroll-watch.min';

// Modules
import commonModule from './common/common.module';
import trackModule from './views/track/track.module'
import homeModule from './views/home/home.module'

// Routing
import router from './router';

// Styles
import mainStyle from '../assets/styles/main.scss';

const required = [
	'app.common',
	'app.home',
	'app.track',
	'ngRoute',
	'pc035860.scrollWatch',
	'thatisuday.dropzone',
];

dropzone.autoDiscover = false;

// This is the app
angular.module('soundtime', required)
    .config(router)
    .controller();
