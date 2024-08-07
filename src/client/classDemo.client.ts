import myMath from "shared/TS/math";
print(myMath.add(1, 2));

import Person from "shared/TS/person";
import Student from "shared/TS/student";

// Erstellen einer Instanz der Person-Klasse
const person = new Person("Alice", 30);
person.greet(); // Ausgabe: Hello, my name is Alice and I am 30 years old.

// Erstellen einer Instanz der Student-Klasse
const student = new Student("Bob", 21, "S12345");
student.greet(); // Ausgabe: Hello, my name is Bob, I am 20 years old and my student ID is S12345.

// Modifizieren und Abfragen der Eigenschaften
student.setName("Robert");
student.setAge(21);
student.setStudentId("S54321");

print(`Updated name: ${student.getName()}`); // Ausgabe: Updated name: Robert
print(`Updated age: ${student.getAge()}`); // Ausgabe: Updated age: 21
print(`Updated student ID: ${student.getStudentId()}`); // Ausgabe: Updated student ID: S54321

import { makeHello } from "shared/TS/module";
print(makeHello("main.client.ts"));
