/* @ngInject */
class NavbarController {
	constructor($scope, $location) {
		this.$location = $location;
		this.$scope = $scope;
		this.$scope.uploadModalIsOpen = false;

		this.$scope.trackId = $location.$$path.split("/").pop();
	}

	goToTrackId() {
		this.$location.path(`/t/${this.$scope.trackId}`);
		this.$scope.$root.navbarMenuIsActive = false;
	}

	submitIfEnter($event) {
		if ($event.key !== "Enter") return;

		this.goToTrackId();
	}
}

export default NavbarController;