/* @ngInject */
class ColorService {
	constructor($rootScope) {
		this.$rootScope = $rootScope;
		
		this.colors = {
			primary: "#00d1b2",
			accent: "#3273dc",
			accText: "#ffffff",
			primText: "#383838",
			secText: "#717171"
		};

		this.$rootScope.colors = this.colors;
	}

	changeColors({primary, accent, accText, primText, secText}) {
		this.colors.primary = primary;
		this.colors.accent = accent;
		this.colors.accText = accText;
		this.colors.primText = primText;
		this.colors.secText = secText;
		
		this.$rootScope.$evalAsync();
	}

	reset() {
		const defaultColors = {
			primary: "#00d1b2",
			accent: "#3273dc",
			accText: "#ffffff",
			primText: "#383838",
			secText: "#717171"
		};

		for (const color in this.colors) {
			this.colors[color] = defaultColors[color];
		}

		this.$rootScope.$evalAsync();
	}
}

export default ColorService;