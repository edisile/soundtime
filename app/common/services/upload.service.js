/* @ngInject */
class UploadService {
	constructor($http, api) {
		//console.log(api.getUploadUrlEndpoint);
		this.$http = $http;
		this.api = api;
	}

	uploadFile(file) {
		// The upload URL request endpoint requires following URL parameters:
		// < endpoint URL > + "?filename=< ... >&type=< ... >&size=< ... >"
		let requestUrl = this.api.getUploadUrlEndpoint + 
				`?filename=${file.name}&type=${file.type}&size=${file.size}`;
				// Thank god template literals exist
		
		this.$http.get(requestUrl).then(
			// On success
			(response) => {
				console.log(response.data);
			},
			// On error
			(error) => {
				console.error(error);
			}
		);
	}
}

export default UploadService;