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
        // TODO: implement upload for real
        this.$scope.files[index].isUploading = !this.$scope.files[index].isUploading;
        this.uploadService.uploadFile(this.$scope.files[index]);
    }
}

export default UploaderController ;
