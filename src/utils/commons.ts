export default class Commons {
	private constructor() {}
	static verifysNumber(data: any) {
		const regex = /^[0-9]{1,}$/;
		return regex.test(data);
	}
}
