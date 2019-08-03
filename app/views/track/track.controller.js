/* @ngInject */
class TrackController {
    constructor($scope, $routeParams, playerService) {
        this.$scope = $scope;
        this.$scope.id = $routeParams.trackId;

        this.playerService = playerService;
        this.$scope.playing = false;

        // TODO: create a rest API to get a track
        // TODO: create a service to request a track
        // TODO: request a track
        // TODO: implement a player
    }

    playTrack() {
        this.playerService.play();
        this.$scope.playing = !this.$scope.playing;
    }

    pauseTrack() {
        this.playerService.pause();
        this.$scope.playing = !this.$scope.playing;
    }
}

export default TrackController;