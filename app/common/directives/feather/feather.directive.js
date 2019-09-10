const s = {
	'xs': {'height': '1em', 'width': '1em'},
	's': {'height': '1.375em', 'width': '1.375em'},
	'm': {'height': '2em', 'width': '2em'},
	'l': {'height': '3em', 'width': '3em'},
	'xl': {'height': '4em', 'width': '4em'},
	'xxl': {'height': '6em', 'width': '6em'}
};

// Replaces the <feather> element with an icon
export default () => (
	{
		restrict: 'E',
		replace: true,
		scope: {
			icon: '@',
			size: '@'
		},
		template: (elem, attr) => {
			const icon = feather.icons[attr.icon];
			const style = attr.size ? s[attr.size] : s['xs'];

			if (icon !== undefined) {
				return icon.toSvg(style);
			} else {
				// Error, icon doesn't exist
				return feather.icons["x-octagon"].toSvg({'color': 'red'});
			}
		}
	}
);