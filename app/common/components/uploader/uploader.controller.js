/* @ngInject */
class UploaderController {
    constructor($scope) {
        $scope.dzOptions = {
            url : '/alt_upload_url',
            paramName : 'audio',
            maxFilesize : '100',
            acceptedFiles : 'audio/*',
            addRemoveLinks : false,
            autoProcessQueue: false
        }

        $scope.files = [];
        $scope.uploads = [];

        $scope.fileSelectionHandler = (files) => {
            for (var i = 0; i < files.length; i++) {
                console.log(files[i]);
                $scope.files.push(files[i]);
                $scope.uploads.push({
                    id: new Date().getTime() + files[i].name, // fake id
                    file_name: files[i].name
                });
            }
        };
    }
}

export default UploaderController ;
