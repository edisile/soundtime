import Vibrant from 'node-vibrant';

/* @ngInject */
class ColorWatchController {
	constructor($element, colorService) {
		this.element = $element[0];
		
		this.element.addEventListener('load',
			() => {
				var v = new Vibrant(this.element, {});
				v.getPalette().then(
					(palette) => {
						console.log(palette);
						for (var s in palette) {
							if (palette.hasOwnProperty(s) && palette[s]) {
								console.log(s, ":", palette[s].getHex());
							}
						}
					}
				);
			}
		);
		
	}
}

export default ColorWatchController;