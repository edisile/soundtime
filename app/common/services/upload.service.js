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
				this.$http.put(response.data.url, file).then(
					// On success
					(uploadResponse) => {
						console.log(uploadResponse);
						file.isUploading = false;
						file.isUploaded = true;
					},
					// On error
					(uploadError) => {
						console.error(uploadError);
						file.isUploading = false;
						file.isUploaded = false;
					}
				);
			},
			// On error
			(error) => {
				console.error(error);
				file.isUploaded = false;
				file.isUploading = false;
				
			}
		);
	}
}

export default UploadService;