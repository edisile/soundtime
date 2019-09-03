/* @ngInject */
class PlayerController {
	constructor($element, $scope, trackInfoService) {
		this.trackInfoService = trackInfoService;
		this.title = "Ayyyy";
		this.artist = "Lmaoooo";
		this.$scope = $scope;
		this.seekValue = 0;
		this.seekBar = angular.element(document.querySelector('#seek-bar'))[0];
		
		this.audio = angular.element($element[0]).find("audio")[0];

		// Getting lenght
		this.audio.oncanplay = ($event) => {
			$scope.duration = this.audio.duration;
		}
		
		this.isPlaying = false;

		this.audio.ontimeupdate = ($event) => {
			//console.log(this.currentTime)
			$scope.currentTime = this.audio.currentTime;
			this.seekValue = this.audio.currentTime / this.audio.duration;
			$scope.$evalAsync();
		}
	}

	seek($event) {
		this.seekValue = $event.offsetX / this.seekBar.offsetWidth;
		this.audio.currentTime = this.seekValue * this.audio.duration;
	}

	playPause() {
		this.isPlaying ? this.audio.pause() : this.audio.play();
		this.isPlaying = !this.isPlaying;
	}
}

export default PlayerController;