import V from 'node-vibrant';
import tc from 'tinycolor2';

/* @ngInject */
class ColorWatchController {
	constructor($element, $rootScope, colorService) {
		this.element = $element[0];
		this.$rootScope = $rootScope;
		this.primary, this.accent, this.primaryText, this.secondaryText;

		this.element.addEventListener('load',
			() => {
				// For some reason higher quality == bigger downsampling, wtf
				let v = new V(this.element, {colorCount: 16, quality: 500});

				v.getPalette().then(
					(palette) => {
						this.primary = palette.Vibrant.getHex();
						
						// Make a new palette extractor with better quality
						v = new V(this.element);

						v.getPalette().then(
							(palette) => {
								this.accent = palette.DarkMuted.getHex();

								// if (tc.readability( tc(this.primary), 
								// 					tc(this.accent) ) < 4.5) {
								// 	this.accent = palette.LightVibrant.getHex();
								// 	let x = this.findContrastColor(tc(this.primary), tc(this.accent), true, true, 4)
								// 	console.log(x.toHexString())
								// }

								this.getTextColors(this.primary, this.accent);

								console.log(this.primary, this.accent,
									this.primaryText, this.secondaryText)
							}
						);
						
					}
				);
			}
		);
		
	}

	getTextColors(primary, accent) {
		let bg = tc(primary), fg = tc(accent);
		let primTextCol, secTextCol;

		let bgLum = bg.getLuminance(), fgLum = fg.getLuminance();
		let contrast = tc.readability(bg, fg);

		let bgLight = 
			(bgLum > fgLum) && ( tc.readability( bg, tc("black") ) >= 4.5 ) ||
				(bgLum <= fgLum) && ( tc.readability( bg, tc("white") ) < 4.5 );

		if (contrast < 4.5) {	
			secTextCol = this.findContrastColor(fg, bg, true, bgLight, 4.5);
			primTextCol = secTextCol.clone().darken(bgLight ? 20 : -10);
		} else {
			primTextCol = fg;
			secTextCol = primTextCol.clone().lighten(bgLight ? 20 : -10);

			if (tc.readability(primTextCol, secTextCol) < 4.5) {
				// secondary is not good enough
				secTextCol = this.findContrastColor(
									secTextCol, bg, true, bgLight, 4.5);
				// change primary as well
				primTextCol = secTextCol.clone().darken(bgLight ? 20 : -10);
			}
		}

		this.primaryText = primTextCol.toHexString(); 
		this.secondaryText = secTextCol.toHexString();
	}

	findContrastColor(color, other, findFg, lightBg, minRatio) {
		let fg = findFg ? color : other;
		let bg = findFg ? other : color;

		if (tc.readability(fg, bg) >= minRatio) return color;

		let c = findFg ? fg.toHsl() : bg.toHsl();
		let low = 0, high = c.l; // c.l is the luminance of the color
		
		for (let i = 0; i < 15 && high - low >= 0.01; i++) {
			let newL = ( (high + low) / 2 );

			if (findFg) {
				fg = tc({h: c.h, s: c.s, l:newL});
			} else {
				bg = tc({h: c.h, s: c.s, l:newL});
			}

			if (tc.readability(fg, bg) > minRatio)
				lightBg ? low = newL : high = newL;
			else
				lightBg ? high = newL : low = newL;
		}

		return tc({h: c.h, s: c.s, l:low});
	}
}

export default ColorWatchController;