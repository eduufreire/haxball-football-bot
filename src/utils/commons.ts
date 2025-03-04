export default class Commons {
	private constructor() {}
	static verifysNumber(data: any) {
		const regex = /^[0-9]{1,}$/;
		return regex.test(data);
	}

	static formaterTimer(time: number) {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}
}
