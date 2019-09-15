/* @ngInject */
class ApiUrlBuilderService {
	constructor(apiConstants) {
		this.api = apiConstants;
	}

	buildGetDownloadUrlRequest(fileId) {
		return this.api.getDownloadUrlEndpoint + `?id=${fileId}`;
	}

	buildGetUploadUrlRequest( {filename, size, type, md5} ) {
		// The upload URL request endpoint requires the following structure:
		// < endpoint URL > + "?filename=< ... >&size=< ... >&type=< ... >&" + 
		// 		"md5=< ... >"

		return this.api.getUploadUrlEndpoint + 
				`?filename=${encodeURIComponent(filename)}` + 
				`&size=${size}&type=${type}&md5=${encodeURIComponent(md5)}`;
				// needed to escape '+' and '/' in the base64 ^
	}

	buildGetTrackInfoRequest(fileId) {
		return this.api.getTrackInfoEndpoint + `?id=${fileId}`;
	}
}

export default ApiUrlBuilderService;