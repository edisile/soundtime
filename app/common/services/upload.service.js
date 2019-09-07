/* @ngInject */
class UploadService {
	constructor($http, apiUrlBuilderService) {
		this.$http = $http;
		this.apiService = apiUrlBuilderService;
		this.filesList = [];
	}

	uploadFile(file) {
		let requestUrl = this.apiService.buildGetUploadUrlRequest(
				{
					filename: file.name,
					size: file.size,
					type: file.type
				}
		);

		file.isUploading = true;
		
		this.$http.get(requestUrl).then(
				// On success
				(response) => {
					console.log(response.data);

					file.fileId = response.data.id;

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

	clearCompleted() {
		for(let i = 0; i < this.filesList.length; i++) { 
			if ( this.filesList[i].isUploaded ) {
				this.filesList.splice(i, 1); 
				i--;
			}
		}
	}
}

export default UploadService;