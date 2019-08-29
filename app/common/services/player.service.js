import {Howl, Howler} from 'howler';

/* @ngInject */
class PlayerService {
	constructor() {
		console.log("colorService");
		this.sound = new Howl({
			src: [""]
		});

		this.sound = new Howl({
			src: ['http://127.0.0.1:8081/Denzel%20Curry%20-%20Shawshank.flac'],
			loop: false,
			volume: 0.5,
			onend: () => {
				console.log('Finished!');
			}
		});
	}

	play() {
		this.sound.play();
	}

	pause() {
		this.sound.pause();
	}
}

export default PlayerService;