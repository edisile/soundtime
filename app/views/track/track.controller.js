/* @ngInject */
class TrackController {
    constructor($scope, $routeParams, colorService/*, playerService*/) {
        this.$scope = $scope;
        this.$scope.id = $routeParams.trackId;

        this.colorService = colorService;

        //this.playerService = playerService;
        this.$scope.playing = false;

        // TODO: create a rest API to get a track
        // TODO: create a service to request a track
        // TODO: request a track
        // TODO: implement a player
    }

    playTrack() {
        this.$scope.playing = !this.$scope.playing;
        console.log(this.$scope.playing);
        this.playerService.play();
    }

    pauseTrack() {
        this.$scope.playing = !this.$scope.playing;
        console.log(this.$scope.playing);
        this.playerService.pause();
    }
}

export default TrackController;