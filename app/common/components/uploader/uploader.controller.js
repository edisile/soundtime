import * as id3 from 'id3js';

/* @ngInject */
class UploaderController {
    constructor($scope) {
        this.$scope = $scope;

        this.$scope.files = [];
        this.$scope.uploads = [];

        console.log(this.$scope.files);
        console.log(this.$scope.uploads);

        this.$scope.fileSelectionHandler = (files) => {
            for (var i = 0; i < files.length; i++) {
                files[i].isUploading = false;
                this.$scope.files.push(files[i]);
                this.$scope.uploads.push({
                    id: new Date().getTime() + files[i].name, // fake id
                    file_name: files[i].name
                });
            }
        };
    }

    removeFile(index) {
        this.$scope.files.splice(index, 1);
        this.$scope.uploads.splice(index, 1);
    }

    uploadFile(index) {
        // TODO: implement upload for real
        this.$scope.files[index].isUploading = !this.$scope.files[index].isUploading;
    }
}

export default UploaderController ;
