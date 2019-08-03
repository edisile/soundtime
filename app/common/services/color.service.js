/* @ngInject */
class ColorService {
	constructor($rootScope) {
		this.$rootScope = $rootScope;
		
		this.$rootScope.primaryBg = {
			"background-color" : "#00d1b2"
		};

		this.$rootScope.primaryFg = {
			"color" : "#00d1b2"
		};

		this.$rootScope.accentBg = {
			"background-color" : "#3273dc"
		};

		this.$rootScope.accentFg = {
			"color" : "#3273dc"
		};
	}
}

export default ColorService;