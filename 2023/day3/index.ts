import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = await readFile(join(__dirname, './input.txt'), 'utf8');

const adjacent = [-1, 0, 1];

// #region Part One
const getPartOneAnswer = (input: string) => {
	const partNumbers = [];
	const lines = input.split('\n').filter((line) => line.trim().length);
	for (const lineNumber of Object.keys(lines).map(Number)) {
		const line = lines[lineNumber];

		const numbers = Array.from(line.matchAll(/\d+/g)).filter(
			(x): x is typeof x & { index: number } => x.index != null
		);
		for (const match of numbers) {
			const [number, numberStart] = [match[0], match.index];
			for (const delta of adjacent) {
				const adjacentLine = lines[lineNumber + delta];
				if (!adjacentLine) continue;

				const adjacentArea = adjacentLine.substring(
					numberStart - 1,
					numberStart + number.length + 1
				);
				if (adjacentArea.match(/[^\d\.]/)) {
					partNumbers.push(Number(number));
					// continue checkNumbers;
				}
			}
		}
	}

	return partNumbers.reduce((acc, num) => (acc += num), 0);
};
console.log('Part 1 answer:', getPartOneAnswer(input));
// #endregion

// #region Part Two

// I can't help but feel that this could be way more elegant...
const getPartTwoAnswer = (input: string) => {
	const gearCombinations: Array<number[]> = [];
	const lines = input.split('\n').filter((line) => line.trim().length);
	for (const lineNumber of Object.keys(lines).map(Number)) {
		const line = lines[lineNumber];

		const gears = Array.from(line.matchAll(/\*/g)).filter(
			(x): x is typeof x & { index: number } => x.index != null
		);
		for (const match of gears) {
			const gearStart = match.index;
			const combination: number[] = [];
			for (const delta of adjacent) {
				const adjacentLine = lines[lineNumber + delta];
				if (!adjacentLine) continue;

				// We know that a number can only be 3 characters long in the puzzle.
				// Sort of cheating, but I really don't want to look harder for this.
				const adjacentArea = adjacentLine.substring(
					gearStart - 3,
					// Account for gear character length
					gearStart + 1 + 3
				);

				const numbers = Array.from(adjacentArea.matchAll(/\d+/g))
					.filter((match): match is typeof match & { index: number } => match.index != null)
					.filter((match) => {
						const [number, index] = [match[0], match.index];
						// If the number is large, and to the left of the gear,
						// the index would be too small, so we potentially take in account
						// its length to figure out if its last number is at least nearby.
						const rightIndex = index + number.length;
						// Are we potentially around the gear symbol, which is near the middle?
						// (considering adjacentArea is 7 characters long)
						return (rightIndex > 2 || index > 2) && index < 5;
					});
				if (numbers.length) {
					numbers.forEach((number) => combination.push(Number(number)));
				}
			}
			if (combination.length > 1) gearCombinations.push(combination);
		}
	}

	return gearCombinations.reduce(
		(acc, combination) =>
			(acc += combination.slice(1).reduce((acc, num) => (acc *= num), combination[0])),
		0
	);
};
console.log('Part 2 answer:', getPartTwoAnswer(input));
// #endregion
