/* @ngInject */
class NavbarController {
	constructor($scope, $location) {
		this.$location = $location;
		this.$scope = $scope;
		this.$scope.uploadModalIsOpen = false;

		if ($location.$$path.includes("/t/")) {
			// This is a track link
			this.$scope.trackId = $location.$$path.split("/").pop();
		}
	}

	goToTrackId() {
		this.$location.path(`/t/${this.$scope.trackId}`);
		this.$scope.$root.navbarMenuIsActive = false; // For mobile
	}

	submitIfEnter($event) {
		if ($event.key !== "Enter") return;

		this.goToTrackId();
	}
}

export default NavbarController;