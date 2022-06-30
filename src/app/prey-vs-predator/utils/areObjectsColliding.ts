import Predator from '../objects/predator';
import Prey, { PREY_HEIGHT, PREY_WIDTH } from '../objects/prey';

const areObjectsColliding = (
    x: number,
    y: number,
    otherObjects: Array<Prey | Predator>
): boolean => {
    for (let i = 0; i < otherObjects.length; i++) {
        const obj = otherObjects[i];
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
