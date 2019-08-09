/* @ngInject */
class HomeController {
	constructor($scope, colorService) {
		this.$scope = $scope;
		this.$scope.colorService = colorService;

		console.log(colorService.colors);
	}
}

export default HomeController;