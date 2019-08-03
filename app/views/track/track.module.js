import angular from 'angular';
import trackController from './track.controller';
import trackStyles from './track.styles.scss';

let trackModule = angular.module('app.track', ['app.common']);

trackModule.controller(trackController);