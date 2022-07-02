import {
    PREDATOR_HEIGHT,
    PREDATOR_WIDTH,
    PREY_HEIGHT,
    PREY_WIDTH,
} from '../constants/constants';
import Predator from '../objects/predator';
import Prey from '../objects/prey';

async function generatePreys(
    amount: number,
    width: number,
    height: number,
    spriteSheet: HTMLImageElement
): Promise<Array<Prey>> {
    const preys: Array<Prey> = [];

    while (preys.length < amount) {
        const x = Math.floor(Math.random() * (width / 3 - PREY_WIDTH));
        const y = Math.floor(Math.random() * (height - PREY_HEIGHT));
        const prey = new Prey(x, y, spriteSheet);
        preys.push(prey);
    }

    return preys;
}

async function generatePredators(
    amount: number,
    width: number,
    height: number,
    spriteSheet: HTMLImageElement
): Promise<Array<Predator>> {
    const predators: Array<Predator> = [];

    while (predators.length < amount) {
        const minX = width / 2 - 10;
        const x =
            Math.floor(Math.random() * (width - minX - PREDATOR_WIDTH)) + minX;
        const y = Math.floor(Math.random() * (height - PREDATOR_HEIGHT));

        const predator = new Predator(x, y, spriteSheet);
        predators.push(predator);
    }

    return predators;
}

export { generatePreys, generatePredators };
