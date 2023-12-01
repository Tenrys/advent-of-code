import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = await readFile(join(__dirname, './input.txt'), 'utf8');

// #region Part One
const getPartOneAnswer = (input: string) => {
	const lines = input.split('\n');

	const lineNumbers = lines
		.map((line) => (line.match(/\d/g) || []).map(Number))
		.filter((numbers) => numbers.length && numbers.every(Number));

	const sum = lineNumbers.reduce((acc, numbers) => {
		const first = numbers[0];
		const last = numbers[numbers.length - 1];
		acc += Number(`${first}${last}`);
		return acc;
	}, 0);

	return sum;
};
console.log('Part 1 answer:', getPartOneAnswer(input));
// #endregion

// #region Part Two
const numberStrings = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
};
const getPartTwoAnswer = (input: string) => {
	const lines = input.split('\n');

	const lineNumbers = lines
		.map((line) => {
			const numberMatches = [];
			numberMatches.push(...Array.from(line.matchAll(/\d/g)));
			for (const numberString in numberStrings) {
				const _matches = Array.from(line.matchAll(new RegExp(numberString, 'g')));
				for (const match of _matches) {
					match[0] = numberStrings[numberString as keyof typeof numberStrings].toString();
					numberMatches.push(match);
				}
			}
			return numberMatches
				.filter((x): x is typeof x & { index: number } => x.index != null)
				.toSorted((a, b) => (a.index > b.index ? 1 : -1))
				.map((x) => Number(x[0]));
		})
		.filter((numbers) => numbers.length && numbers.every(Number));

	const sum = lineNumbers.reduce((acc, numbers, i) => {
		const first = numbers[0];
		const last = numbers[numbers.length - 1];
		acc += Number(`${first}${last}`);
		return acc;
	}, 0);

	return sum;
};
console.log('Part 2 answer:', getPartTwoAnswer(input));
// #endregion

