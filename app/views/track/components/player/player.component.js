import playerTemplate from './player.template.html';
import playerController from './player.controller';
import playerStyle from './player.styles.scss';

export default {
	template: playerTemplate,
	controller: playerController,
	bindings: {
		previewSource: '<', // Link to the audio file
		tags: '<' // An object that contains the tags of the audio file
	}
};