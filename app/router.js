import trackViewTemplate from './views/track/track.template.html';
import trackViewController from './views/track/track.controller';
import homeViewTemplate from './views/home/home.template.html';
import homeViewController from './views/home/home.controller';

/* @ngInject */
export default ($routeProvider, $locationProvider) => {
    $routeProvider
        .when('/', {
            template: homeViewTemplate,
            controller: homeViewController,
            controllerAs: '$ctrl'
        })
        .when('/t/:trackId', {
            template: trackViewTemplate,
            controller: trackViewController,
            controllerAs: '$ctrl'
        })
        .otherwise({
            redirectTo: '/'
        });


    $locationProvider.html5Mode(true).hashPrefix('!');
};
