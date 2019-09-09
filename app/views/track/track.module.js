import trackController from './track.controller';
import trackInfoService from './services/trackInfo.service';
import trackStyles from './track.styles.scss';
import playerComponent from './components/player/player.component';
import secondsToTimeFilter from './filters/secondsToTime.filter';

let trackModule = angular.module('app.track', ['app.common']);

trackModule.controller(trackController);
trackModule.filter('secondsToTimeFilter', secondsToTimeFilter);
trackModule.service('trackInfoService', trackInfoService);
trackModule.component('player', playerComponent);

export default trackModule;