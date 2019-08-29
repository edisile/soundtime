/* @ngInject */
class ColorService {
	constructor($rootScope) {
		console.log("colorService");
		this.$rootScope = $rootScope;
		
		this.colors = {
			primary: "#00d1b2",
			accent: "#3273dc",
			accentStrong: "#3273dc"
		};

		this.$rootScope.colors = this.colors;
	}

	changePrimary(newPrimary) {
		this.colors.primary = newPrimary;
	}

	changeAccent(newAccent) {
		this.colors.accent = newAccent;
	}

	changeAccentStrong(newAccentStrong) {
		this.colors.accentStrong = newAccentStrong;
	}

	update() {
		this.$rootScope.$apply();
	}
}

export default ColorService;