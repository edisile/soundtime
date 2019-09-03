export default () => {
	return (input) => {

		if (input === undefined) return "0:00";

		// ~~ Truncates to int
		let minutes = ~~(input / 60);
		let seconds = ~~(input % 60);

		return `${minutes}:${ seconds < 10 ? 0 : ""}${seconds}`;
	};
};