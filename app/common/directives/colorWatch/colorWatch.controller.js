import V from 'node-vibrant';
import tc from 'tinycolor2';

/* @ngInject */
class ColorWatchController {
	constructor($element, colorService) {
		this.element = $element[0];
		this.primary, this.accent, this.primaryText, this.secondaryText;

		this.element.addEventListener('load',
			() => {
				let i = new Image(500, 500);
				i.src = this.element.src;

				// For some reason higher quality == bigger downsampling, wtf
				let v = new V(i, { quality: 1.5 });

				v.getPalette().then(
					(palette) => {
						// Get dominant color swatches
						let ps, as;

						[ps, as] = this.getMainColors(palette);

						// console.log(ps);
						// console.log(as);
						
						this.primary = ps.getHex();
						this.accent = as.getHex();

						this.enhanceMainColors();

						[this.primaryText, this.secondaryText] = 
								this.getTextColors(this.primary, this.accent);

						this.accentText = tc.mostReadable(this.accent, 
								["white", this.primary, this.primaryText, 
									this.secondaryText]).toHexString();

						colorService.changeColors(
							{
								primary: this.primary,
								accent: this.accent,
								accText: this.accentText,
								primText: this.primaryText,
								secText: this.secondaryText
							}
						);
					}
				);
			}
		);
	}

	getMainColors(palette) {
		let ps, as;
		let colors = Object.values(palette).sort(
			(a, b) => {
				return a.population > b.population ? -1 : 1;
			}
		);

		// console.log(palette);

		if ( (palette.Muted.population / colors[1].population) < 2 && 
				(palette.Muted.population / colors[2].population) < 3 ) {

			// The image isn't mostly muted so whatever
			// console.log("Removing muted");
			delete palette.Muted; // No one likes muted colors anyway...

			colors = Object.values(palette).sort(
				(a, b) => {
					return a.population > b.population ? -1 : 1;
				}
			);
		}

		ps = colors[0]; as = colors[1];

		if ( ps.getHex() === palette.Vibrant.getHex() ) {
			// Vibrant color might be too strong for a primary
			// console.log("Swapping vibrant to accent");
			[as, ps] = [ps, as];
		}

		return [ps, as];
	}

	enhanceMainColors() {
		let p = tc(this.primary);
		let a = tc(this.accent);

		let contrast = tc.readability(p, a);
		let dE = this.deltaE(p.toRgb(), a.toRgb());
		// console.log(`dE = ${dE}\ncontrast = ${contrast}`);

		let i = 0;
		while ( i++ < 10 && (dE < 30 || contrast < 4) ) {

			// console.log(p.toHexString(), a.toHexString())
			p.isLight() ? a.darken(5) : a.lighten(5);
										
			this.accent = a.toHexString();

			dE = this.deltaE(p.toRgb(), a.toRgb());
			contrast = tc.readability(p, a);

			// console.log(`dE = ${dE}\ncontrast = ${contrast}`);

			if (dE >= 45) break;
		}
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

		return [primTextCol.toHexString(), secTextCol.toHexString()];
	}

	findContrastColor(color, other, findFg, lightBg, minRatio) {
		let fg = findFg ? color : other;
		let bg = findFg ? other : color;

		if (tc.readability(fg, bg) >= minRatio) return fg;

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

	deltaE(rgbA, rgbB) {
		let labA = this.rgb2lab(rgbA);
		let labB = this.rgb2lab(rgbB);
		let deltaL = labA[0] - labB[0];
		let deltaA = labA[1] - labB[1];
		let deltaB = labA[2] - labB[2];
		let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
		let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
		let deltaC = c1 - c2;
		let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
		deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
		let sc = 1.0 + 0.045 * c1;
		let sh = 1.0 + 0.015 * c1;
		let deltaLKlsl = deltaL / (1.0);
		let deltaCkcsc = deltaC / (sc);
		let deltaHkhsh = deltaH / (sh);
		let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;

		return i < 0 ? 0 : Math.sqrt(i);
	}

	rgb2lab({r, g, b}){
		let x, y, z;
		r /= 255; g /= 255; b /= 255;

		r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
		g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
		b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
		x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
		y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
		z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
		x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
		y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
		z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
		return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
	}
}

export default ColorWatchController;