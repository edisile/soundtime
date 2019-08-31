//import * as id3 from 'id3js';

/* @ngInject */
class UploaderController {
    constructor($scope, uploadService) {
        this.$scope = $scope;
        this.uploadService = uploadService;

        this.$scope.files = [];

        console.log(this.$scope.files);

        this.$scope.fileSelectionHandler = 
            (files) => {
                for (var i = 0; i < files.length; i++) {
                    files[i].isUploading = false;
                    files[i].isUploaded = false;
                    this.$scope.files.push(files[i]);
                }
            };
    }

    removeFile(index) {
        this.$scope.files.splice(index, 1);
    }

    uploadFile(index) {
        // TODO: clean this up
        this.$scope.files[index].isUploading = !this.$scope.files[index].isUploading;
        this.uploadService.uploadFile(this.$scope.files[index]);
    }

    getLink(index) {
        // THIS ONLY WORKS OVER HTTPS
        // TODO:                make this stuff here VVV a real link
        navigator.clipboard.writeText(this.$scope.files[index].fileId).then(
            // On success
            (x) => {
                console.log("Copied to clipboard");
            },
            // On error
            (x) => {
                // TODO: add fallback maybe? Not really a priority
                console.error("Couldn't copy to clipboard");
            }
        );
    }
}

export default UploaderController ;
