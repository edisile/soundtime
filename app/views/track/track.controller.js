/* @ngInject */
class TrackController {
    constructor($http, $scope, $routeParams, trackInfoService, colorService) {
        colorService.reset()
        this.$http = $http;
        this.$scope = $scope;
        this.id = $routeParams.trackId;
        this.$scope.id = $routeParams.trackId;
        this.trackInfoService = trackInfoService;

        this.$scope.trackInfoService = this.trackInfoService;

        this.trackInfoService.getInfo($routeParams.trackId);

        //this.colorService = colorService;

        this.$scope.playing = false;
        
        this.$scope.waitingForDownload = false;
        this.$scope.downloadStarted = false;
        this.$scope.errorDuringRequest = false;
    }

    downloadTrack() {
        console.log("Requesting link")
        this.$scope.waitingForDownload = true;
        this.$scope.downloadStarted = false;
        this.$scope.errorDuringRequest = false;
        let promise = this.trackInfoService.getDownloadLink(this.id);

        promise.then(
                // On success
                (response) => {
                    // Download
                    window.open(response.data.url,"","");
                    // ^ Horrendous workaround, ugly to see
                    this.$scope.waitingForDownload = false;
                    this.$scope.downloadStarted = true;
                },
                // On error
                (error) => {
                    console.error(error);
                    this.$scope.waitingForDownload = false;
                    this.$scope.errorDuringRequest = true;
                }
        );
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