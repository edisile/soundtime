/* @ngInject */
class ApiUrlBuilderService {
	constructor(apiConstants) {
		this.api = apiConstants;
	}

	buildGetUploadUrlRequest( {filename, size, type} ) {
		// The upload URL request endpoint requires the following structure:
		// < endpoint URL > + "?filename=< ... >&size=< ... >&type=< ... >"

		return this.api.getUploadUrlEndpoint + 
					`?filename=${encodeURIComponent(filename)}` + 
					`&size=${size}&type=${type}`;
	}

	buildGetTrackInfoRequest(fileId) {
		return this.api.getTrackInfoEndpoint + `?id=${fileId}`;
	}
}

export default ApiUrlBuilderService;