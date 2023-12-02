import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = await readFile(join(__dirname, './input.txt'), 'utf8');

// #region Part One
const maxColorAmounts = {
	red: 12,
	green: 13,
	blue: 14,
};
const getPartOneAnswer = (input: string) => {
	const games = input.split('\n');
	const possible = [];

	mainLoop: for (const game of games) {
		if (!game.trim().length) continue;

		const [gameName, cubeSetsStr] = game.split(':');
		const cubeSets = cubeSetsStr.trim().split(';');
		for (const cubeSet of cubeSets) {
			const cubes = cubeSet.split(',').map((x) => x.trim());
			for (const [amountStr, color] of cubes.map((coloredCubes) =>
				coloredCubes.split(' ')
			) as Array<[string, keyof typeof maxColorAmounts]>) {
				const amount = Number(amountStr);

				if (amount > maxColorAmounts[color]) {
					// Impossible game, we move on.
					continue mainLoop;
				}
			}
		}

		// We've reached this far into the loop and haven't moved on, game is possible.
		const [, gameId] = gameName.split(' ');
		possible.push(Number(gameId));
	}

	return possible.reduce((acc, id) => {
		acc += id;
		return acc;
	}, 0);
};
console.log('Part 1 answer:', getPartOneAnswer(input));
// #endregion

// #region Part Two
const getPartTwoAnswer = (input: string) => {
	const games = input.split('\n');
	const powers = [];

	for (const game of games) {
		if (!game.trim().length) continue;

		const minColorAmounts = {
			red: 0,
			green: 0,
			blue: 0,
		};
		const [, cubeSetsStr] = game.split(':');
		const cubeSets = cubeSetsStr.trim().split(';');
		for (const cubeSet of cubeSets) {
			const cubes = cubeSet.split(',').map((x) => x.trim());
			for (const [amountStr, color] of cubes.map((coloredCubes) =>
				coloredCubes.split(' ')
			) as Array<[string, keyof typeof maxColorAmounts]>) {
				const amount = Number(amountStr);

				if (amount > minColorAmounts[color]) {
					minColorAmounts[color] = amount;
				}
			}
		}

		const mins = Object.values(minColorAmounts);
		powers.push(
			mins.slice(1).reduce((acc, min) => {
				acc *= min;
				return acc;
			}, mins[0])
		);
	}

	return powers.reduce((acc, power) => {
		acc += power;
		return acc;
	}, 0);
};
console.log('Part 2 answer:', getPartTwoAnswer(input));
// #endregion
