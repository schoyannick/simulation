import Predator from '../objects/predator';
import Prey from '../objects/prey';

function createObject(
    type: 'prey' | 'predator',
    x: number,
    y: number,
    image: HTMLImageElement
) {
    let object = null;

    if (type === 'prey') {
        object = new Prey(x, y, image);
    } else {
        object = new Predator(x, y, image);
    }

    const event = new CustomEvent('create', {
        detail: object,
    });
    window.dispatchEvent(event);
}

export default createObject;
