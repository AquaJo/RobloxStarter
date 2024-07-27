// Basisklasse Person.ts
export default class Person {
	// Instanzvariablen
	private name: string;
	private age: number;

	// Konstruktor
	constructor(name: string, age: number) {
		this.name = name;
		this.age = age;
	}

	// Methode, die den Namen zurückgibt
	public getName(): string {
		return this.name;
	}

	// Methode, die das Alter zurückgibt
	public getAge(): number {
		return this.age;
	}

	// Methode, um den Namen zu setzen
	public setName(name: string): void {
		this.name = name;
	}

	// Methode, um das Alter zu setzen
	public setAge(age: number): void {
		this.age = age;
	}

	// Methode, die eine Begrüßung ausgibt
	public greet(): void {
		print(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
	}
}
