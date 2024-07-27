import Person from "./person";
export default class Student extends Person {
	private studentId: string;

	constructor(name: string, age: number, studentId: string) {
		super(name, age); // Aufruf des Konstruktors der Basisklasse
		this.studentId = studentId;
	}

	// Methode, die die Student-ID zurückgibt
	public getStudentId(): string {
		return this.studentId;
	}

	// Methode, um die Student-ID zu setzen
	public setStudentId(studentId: string): void {
		this.studentId = studentId;
	}

	// Überschreiben der greet-Methode
	public greet(): void {
		print(
			`Hello, my name is ${this.getName()}, I am ${this.getAge()} years old and my student ID is ${this.studentId}.`,
		);
	}
}
