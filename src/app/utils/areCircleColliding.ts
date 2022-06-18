import Prey, { PREY_RADIUS } from '../objects/prey';

const areCircleColliding = (
    x: number,
    y: number,
    otherObjects: Array<Prey>
): boolean => {
    for (let i = 0; i < otherObjects.length; i++) {
        const obj = otherObjects[i];
        if (
            Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2) <=
            Math.pow(PREY_RADIUS * 2, 2)
        ) {
            return true;
        }
    }

    return false;
};

export default areCircleColliding;
