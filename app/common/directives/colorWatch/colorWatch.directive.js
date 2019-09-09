import colorWatchController from './colorWatch.controller';

export default () => (
	{
		restrict: 'A',
		bindToController: {
			// Bind attributes here
		},
		controller: ['$element', colorWatchController]
		    // $element is the element to which the directive is attached
	}
);