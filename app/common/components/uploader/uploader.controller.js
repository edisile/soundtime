/* @ngInject */
class UploaderController {
    constructor($scope, uploadService, websiteNameConstant) {
        this.$scope = $scope;
        this.uploadService = uploadService;
        this.websiteName = websiteNameConstant;

        this.$scope.files = this.uploadService.filesList;

        console.log(this.$scope.files);

        this.$scope.fileSelectionHandler = 
            (newFiles) => {
                for (var i = 0; i < newFiles.length; i++) {
                    newFiles[i].isUploading = false;
                    newFiles[i].isUploaded = false;
                    this.$scope.files.push(newFiles[i]);
                }
            };
    }

    clearCompleted() {
        this.uploadService.clearCompleted();
    }

    removeFile(index) {
        this.$scope.files.splice(index, 1);
    }

    uploadFile(index) {
        this.uploadService.uploadFile(this.$scope.files[index]);
    }

    getLink(index) {
        // THIS ONLY WORKS OVER HTTPS
        // TODO:                make this stuff here VVV a real link
        const url = `${this.websiteName}/t/${this.$scope.files[index].fileId}`;
        navigator.clipboard.writeText(url).then(
            // On success
            (x) => {
                console.log("URL copied to clipboard");
            },
            // On error
            (x) => {
                // TODO: add fallback maybe? Not really a priority
                console.error("Couldn't copy to clipboard");
            }
        );
    }
}

export default UploaderController;
