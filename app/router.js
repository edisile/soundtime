import trackViewTemplate from './views/track/track.template.html';
import trackViewController from './views/track/track.controller';
import homeViewTemplate from './views/home/home.template.html';
import homeViewController from './views/home/home.controller';

/* @ngInject */
export default ($routeProvider) => {
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


    // $locationProvider.html5Mode(true);
    // ^ Do NOT uncomment this unless you're ready to face the consequences!
    //
    // html5mode is "bugged" (technically it is expected behaviour after all, but still...): html5mode disables
    // #! routing and causes a 404 when refreshing the page while inside a routed view
    // The only way to solve this while keeping html5mode active is adding server-side URL rewriting
}
