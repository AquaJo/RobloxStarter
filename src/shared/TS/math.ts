export default class MathUtils {
	/**
	 * Adds two numbers together.
	 *
	 * @param {number} x - The first number to add.
	 * @param {number} y - The second number to add.
	 * @return {number} The sum of the two numbers.
	 */
	static add(x: number, y: number): number {
		// Add the two numbers together and return the result.
		return x + y;
	}

	/**
	 * Subtracts the second number from the first number.
	 *
	 * @param {number} x - The number to subtract from.
	 * @param {number} y - The number to subtract.
	 * @return {number} The result of subtracting the second number from the first.
	 */
	static subtract(x: number, y: number): number {
		// Subtract the second number from the first number and return the result.
		return x - y;
	}

	/**
	 * Multiplies two numbers together.
	 *
	 * @param {number} x - The first number to multiply.
	 * @param {number} y - The second number to multiply.
	 * @return {number} The product of the two numbers.
	 */
	static multiply(x: number, y: number): number {
		// Multiply the two numbers together and return the result.
		return x * y;
	}

	/**
	 * Divides the first number by the second number.
	 *
	 * @param {number} x - The dividend.
	 * @param {number} y - The divisor.
	 * @return {number} The quotient of the division.
	 */
	static divide(x: number, y: number): number {
		// Divide the first number by the second number and return the result.
		return x / y;
	}
	/**
	 * Calculates the factorial of a given number.
	 *
	 * @param {number} x - The number to calculate the factorial of.
	 * @return {number} The factorial of the given number.
	 */
	static factorial(x: number): number {
		if (x === 0 || x === 1) {
			return 1;
		}
		return x * MathUtils.factorial(x - 1);
	}
}
