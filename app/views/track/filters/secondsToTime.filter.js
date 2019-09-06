export default () => {
	return (input) => {
		if (input === undefined) return "0:00";

		let isNegative = input < 0;

		if (isNegative) input *= -1;

		// ~~ Truncates to int
		let minutes = ~~(input / 60);
		let seconds = ~~(input % 60);

		return `${isNegative ? "-" : ""}${minutes}:${ seconds < 10 ? 0 : ""}${seconds}`;
	};
};