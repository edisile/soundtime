/* @ngInject */
class UploaderController {
    constructor($scope, uploadService, websiteNameConstant) {
        this.$scope = $scope;
        this.uploadService = uploadService;
        this.websiteName = websiteNameConstant;

        this.$scope.files = this.uploadService.filesList;

        this.$scope.fileSelectionHandler = 
            (newFiles) => {
                for (var i = 0; i < newFiles.length; i++) {
                    // console.log(newFiles[i])

                    newFiles[i].isUploading = false;
                    newFiles[i].isUploaded = false;
                    newFiles[i].isAudio = newFiles[i].type.includes('audio');

                    this.$scope.files.push(newFiles[i]);
                }
            };

        this.$scope.links = "";
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
        let file = this.$scope.files[index];
        const url = `${this.websiteName}/t/${file.fileId}`;

        if (navigator.clipboard){
            // This is a browser supporting clipboard and uses HTTPS

            navigator.clipboard.writeText(url).then(
                // On success
                (x) => {
                    // console.log("URL copied to clipboard");
                    file.urlCopied = true;
                },
                // On error
                (x) => {
                    console.error("Couldn't copy to clipboard");
                    console.warn("falling back to manual copy");
                    this.$scope.links += `${url} : ${file.name}\n`;
                }
            );
        } else {
            console.warn("navigator.clipboard not supported", 
                    "falling back to manual copy");
            this.$scope.links += `🎶: ${file.name}\n🔗: ${url}\n`;
        }
    }
}

export default UploaderController;
