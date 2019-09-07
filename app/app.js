// Angular
import angular from 'angular';

// Libraries
	// In-app routing
import ngRoute from 'angular-route';
	// Drag and drop file upload
import angularUploads from '../node_modules/angular-uploads/dist/angular-uploads.min.js';
import angularViewhead from '../node_modules/angularjs-viewhead/angularjs-viewhead.js';

// Modules
import commonModule from './common/common.module';
import configModule from './config/config.module';
import homeModule from './views/home/home.module';
import trackModule from './views/track/track.module';

// Routing configuration
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
	'viewhead'
];

// This is the app
let app = angular.module('soundtime', required).config(router);
