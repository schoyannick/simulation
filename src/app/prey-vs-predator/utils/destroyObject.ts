import Predator from '../objects/predator';
import Prey from '../objects/prey';

function destroyObject(object: Prey | Predator) {
    const event = new CustomEvent('destroy', {
        detail: object,
    });
    window.dispatchEvent(event);
}

export default destroyObject;
