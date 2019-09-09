/* @ngInject */
class PlayerController {
	constructor($element, $scope) {
		this.$scope = $scope;

		this.isPlaying = false;
		this.seekValue = 0;
		this.showRemainingTime = true;
		
		this.seekBar = angular.element(document.querySelector('#seek-bar'))[0];
		this.audio = angular.element($element[0]).find("audio")[0];

		// Getting lenght
		this.audio.onloadedmetadata = ($event) => {
			$scope.duration = this.audio.duration;
			$scope.$evalAsync();
		}
		
		this.audio.onended = ($event) => {
			this.isPlaying = false;
			this.audio.currentTime = 0;
		}

		this.audio.onpause = ($event) => {
			this.isPlaying = false;
		}

		this.audio.onplay = ($event) => {
			this.isPlaying = true;
		}

		// Updating current time
		this.audio.ontimeupdate = ($event) => {
			$scope.currentTime = this.audio.currentTime;
			this.seekValue = this.audio.currentTime / this.audio.duration;
			$scope.$evalAsync();
		}
	}

	seek($event) {
		let newSeek = $event.offsetX / (this.seekBar.offsetWidth - 42);
		// 						   42 px offset because of padding ^^^
		let newTime = newSeek * this.audio.duration;
		
		if ( newSeek !== Infinity && !isNaN(newTime) ){	
			this.seekValue = newSeek;
			this.audio.currentTime = newTime;
		}
	}

	playPause() {
		this.isPlaying ? this.audio.pause() : this.audio.play();
	}
}

export default PlayerController;