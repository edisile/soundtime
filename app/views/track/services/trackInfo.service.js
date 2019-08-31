/* @ngInject */
class TrackInfoService {
	constructor($http, apiUrlBuilderService) {
		this.$http = $http;
		this.apiService = apiUrlBuilderService;

		this.pendingRequest = false;
		this.error = undefined;

		this.trackDetails = {
			filename: undefined,
			fileType: undefined,
			size: undefined,
			uploadDate: undefined
		};
	}

	getInfo(id) {
		let requestUrl = this.apiService.buildGetTrackInfoRequest(id);

		let promise = this.$http.get(requestUrl);

		this.pendingRequest = true;
		this.error = undefined;

		// Clear track details
		for (let k in this.trackDetails) {
			if (this.trackDetails.hasOwnProperty(k)) 
				this.trackDetails[k] = undefined;
		}

		promise.then(
				// On success
				(response) => {
					console.log(response)
					console.log("ok")
					for (let k in response.data) {
						if (response.data.hasOwnProperty(k)) 
							this.trackDetails[k] = response.data[k];
					}

					this.pendingRequest = false;
				},
				// On error
				(response) => {
					console.error("not ok")
					this.pendingRequest = false;
					this.error = "Something went wrong during the request " + 
							"for this track...";
				}
		);
	}
}

export default TrackInfoService;