import * as PIXI from 'pixi.js';

import {
    PREDATOR_HEIGHT,
    PREDATOR_WIDTH,
    PREY_HEIGHT,
    PREY_WIDTH,
} from 'src/app/prey-vs-predator/constants/constants';
import getPredator, { Predator } from '../objects/predator';
import getPrey, { Prey } from '../objects/prey';

function generatePreys(
    amount: number,
    width: number,
    height: number,
    spriteSheet: PIXI.Spritesheet
): Array<Prey> {
    const preys: Array<Prey> = [];

    while (preys.length < amount) {
        const x = Math.floor(Math.random() * (width / 3 - PREY_WIDTH));
        const y = Math.floor(Math.random() * (height - PREY_HEIGHT));
        const prey = getPrey(x, y, spriteSheet);
        preys.push(prey);
    }

    return preys;
}

function generatePredators(
    amount: number,
    width: number,
    height: number,
    spriteSheet: PIXI.Spritesheet
): Array<Predator> {
    const predators: Array<Predator> = [];

    while (predators.length < amount) {
        const minX = width / 2 - 10;
        const x =
            Math.floor(Math.random() * (width - minX - PREDATOR_WIDTH)) + minX;
        const y = Math.floor(Math.random() * (height - PREDATOR_HEIGHT));

        const predator = getPredator(x, y, spriteSheet);
        predators.push(predator);
    }

    return predators;
}

export { generatePreys, generatePredators };
