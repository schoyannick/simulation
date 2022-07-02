import Predator, { PREDATOR_HEIGHT, PREDATOR_WIDTH } from '../objects/predator';
import Prey, { PREY_HEIGHT, PREY_WIDTH } from '../objects/prey';

async function generatePreys(
    amount: number,
    width: number,
    height: number
): Promise<Array<Prey>> {
    const preyImage = new Image();
    preyImage.src = '/assets/prey.png';

    const imageLoaded = new Promise<void>((res) => {
        preyImage.addEventListener('load', () => {
            res();
        });
    });

    await imageLoaded;

    const preys: Array<Prey> = [];

    while (preys.length < amount) {
        const x = Math.floor(Math.random() * (width / 3 - PREY_WIDTH));
        const y = Math.floor(Math.random() * (height - PREY_HEIGHT));
        const prey = new Prey(x, y, preyImage);
        preys.push(prey);
    }

    return preys;
}

async function generatePredators(
    amount: number,
    width: number,
    height: number
): Promise<Array<Predator>> {
    const predatorImage = new Image();
    predatorImage.src = '/assets/predator.png';

    const imageLoaded = new Promise<void>((res) => {
        predatorImage.addEventListener('load', () => {
            res();
        });
    });

    await imageLoaded;

    const predators: Array<Predator> = [];

    while (predators.length < amount) {
        const minX = width / 2 - 10;
        const x =
            Math.floor(Math.random() * (width - minX - PREDATOR_WIDTH)) + minX;
        const y = Math.floor(Math.random() * (height - PREDATOR_HEIGHT));

        const predator = new Predator(x, y, predatorImage);
        predators.push(predator);
    }

    return predators;
}

export { generatePreys, generatePredators };
