import md5Calc from 'browser-md5-file';

/* @ngInject */
class UploadService {
	constructor($http, apiUrlBuilderService) {
		this.$http = $http;
		this.apiService = apiUrlBuilderService;
		this.filesList = [];
	}

	calculateMd5(file) {
		new md5Calc().md5(file,
		    (err, md5Str) => {
		        if (!err) {
		        	// Encode the md5 to base64 because S3 wants it this way
		        	const b64Md5 = btoa(md5Str.match(/\w{2}/g).map(
		        				(x) => String.fromCharCode(parseInt(x, 16))
		        			).join(""));

		            file.md5 = b64Md5;
		            
		            this.uploadFile(file);
		        } else {
		            file.error = true;
		        }
		    }
		);
	}

	uploadFile(file) {
		if (!file.md5) return this.calculateMd5(file);

		// console.log(file);

		let requestUrl = this.apiService.buildGetUploadUrlRequest(
				{
					filename: file.name,
					size: file.size,
					type: file.type,
					md5: file.md5
				}
		);

		// console.log(requestUrl);

		file.isUploading = true;
		
		this.$http.get(requestUrl).then(
				// On success
				(response) => {
					// console.log(response.data);

					file.fileId = response.data.id;

					const config = {
						headers: {
							"Content-MD5": file.md5,
							"Content-Type": file.type
						},
						uploadEventHandlers: {
							progress: (event) => {
								// console.log(event);
								const p = event.loaded / event.total;
								file.uploadProgress = ~~(p * 100);
												   // ^^^ ~~(float) -> int
							}
						}
					};

					this.$http.put(response.data.url, file, config).then(
						// On success
						(uploadResponse) => {
							// console.log(uploadResponse);
							file.isUploading = false;
							file.isUploaded = true;
						},
						// On error
						(uploadError) => {
							console.error(uploadError);
							file.isUploading = false;
							file.isUploaded = false;

							file.error = true;
						}
					);
				},
				// On error
				(error) => {
					console.error(error);
					file.isUploaded = false;
					file.isUploading = false;

					file.error = true;
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