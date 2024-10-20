export interface Database {
	getValue(): number
	setValue(arg: number): void
}

export class Banco implements Database {
	private value = 0;

	public setValue(arg: number) { 
		this.value = arg
	}

	public getValue() {
		return this.value
	}
}

export const db = new Banco();
