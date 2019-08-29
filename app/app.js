// Angular
import angular from 'angular';
import ngRoute from 'angular-route';

// Libraries
	// Drag and drop file upload
import angularUploads from '../node_modules/angular-uploads/dist/angular-uploads.min.js';
	// On scroll events
import scrollWatch from '../node_modules/angular-scroll-watch/build/angular-scroll-watch.min';

// Modules
import commonModule from './common/common.module';
import configModule from './config/config.module';
import trackModule from './views/track/track.module';
import homeModule from './views/home/home.module';

// Routing
import router from './router';

// Styles
import mainStyle from '../assets/styles/main.scss';

const required = [
	'app.common',
	'app.config',
	'app.home',
	'app.track',
	'msl.uploads',
	'ngRoute',
	'pc035860.scrollWatch',
	//'thatisuday.dropzone',
];

//dropzone.autoDiscover = false;

// This is the app
angular.module('soundtime', required)
    .config(router)
    .controller();
