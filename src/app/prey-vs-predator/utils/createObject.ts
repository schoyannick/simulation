import Predator from '../objects/predator';
import Prey from '../objects/prey';

function createPrey(x: number, y: number, image: HTMLImageElement) {
    const prey = new Prey(x, y, image);

    const event = new CustomEvent('createPrey', {
        detail: prey,
    });
    window.dispatchEvent(event);
}

function createPredator(x: number, y: number, image: HTMLImageElement) {
    const predator = new Predator(x, y, image);

    const event = new CustomEvent('createPredator', {
        detail: predator,
    });
    window.dispatchEvent(event);
}

export { createPrey, createPredator };
