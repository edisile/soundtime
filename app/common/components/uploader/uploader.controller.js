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
    }
}

export default UploaderController ;
