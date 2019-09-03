/* @ngInject */
class PlayerController {
	constructor($element, $scope, trackInfoService) {
		this.trackInfoService = trackInfoService;
		
		this.$scope = $scope;
		this.isPlaying = false;
		this.seekValue = 0;
		
		this.seekBar = angular.element(document.querySelector('#seek-bar'))[0];
		this.audio = angular.element($element[0]).find("audio")[0];

		// Getting lenght
		this.audio.onloadedmetadata = ($event) => {
			$scope.duration = this.audio.duration;
			$scope.$evalAsync();
		}
		
		this.audio.onended = ($event) => {
			this.isPlaying = false;
		}

		// Updating current time
		this.audio.ontimeupdate = ($event) => {
			$scope.currentTime = this.audio.currentTime;
			this.seekValue = this.audio.currentTime / this.audio.duration;
			$scope.$evalAsync();
		}
	}

	seek($event) {
		console.log($event.offsetX)
		let newSeek = $event.offsetX / (this.seekBar.offsetWidth - 42);
		// 							42 px offset because of padding ^
		let newTime = newSeek * this.audio.duration;
		
		console.log(newSeek, newTime)
		if (newSeek !== Infinity && !isNaN(newTime)){	
			this.seekValue = newSeek;
			this.audio.currentTime = newTime;
		}
	}

	playPause() {
		this.isPlaying ? this.audio.pause() : this.audio.play();
		this.isPlaying = !this.isPlaying;
	}
}

export default PlayerController;