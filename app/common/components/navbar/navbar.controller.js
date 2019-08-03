/* @ngInject */
class NavbarController {
	constructor($scope) {
		this.scope = $scope;
		this.scope.uploadModalIsOpen = false;
	}

	changeModalStatus() {
		this.scope.uploadModalIsOpen = !this.scope.uploadModalIsOpen;
	}
}

export default NavbarController;