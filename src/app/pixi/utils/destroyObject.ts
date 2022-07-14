import { Predator } from '../objects/predator';
import { Prey } from '../objects/prey';

function destroyPrey(object: Prey) {
    const event = new CustomEvent('destroyPrey', {
        detail: object,
    });
    window.dispatchEvent(event);
}

function destroyPredator(object: Predator) {
    const event = new CustomEvent('destroyPredator', {
        detail: object,
    });
    window.dispatchEvent(event);
}

export { destroyPrey, destroyPredator };
