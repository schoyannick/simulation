import { PREY_HEIGHT, PREY_WIDTH } from '../constants/constants';
import Predator from '../objects/predator';
import Prey from '../objects/prey';

const areObjectsColliding = (
    x: number,
    y: number,
    objects: Array<Prey | Predator>
): boolean => {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (
            x < obj.x + PREY_WIDTH &&
            x + PREY_WIDTH > obj.x &&
            y < obj.y + PREY_HEIGHT &&
            y + PREY_HEIGHT > obj.y
        ) {
            return true;
        }
    }

    return false;
};

export default areObjectsColliding;
