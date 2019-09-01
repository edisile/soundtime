export default () => {
	return (input) => {

		if (input == undefined) return "";

		const scale = {
			0: "B",
			1: "KB",
			2: "MB",
			3: "GB",
			4: "TB"
		};

		let i = 0;
		for (i; input > 1023; i++) {
			input /= 1024;
			console.log(input);
		}

		return `${input.toFixed(2)} ${scale[i]}`;
	};
}