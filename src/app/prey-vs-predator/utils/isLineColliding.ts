import { PREY_HEIGHT, PREY_WIDTH } from '../constants/constants';
import Predator from '../objects/predator';
import Prey from '../objects/prey';

const isLineCollidingHelper = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
) => {
    const uA =
        ((x4 - x3) * (startY - y3) - (y4 - y3) * (startX - x3)) /
        ((y4 - y3) * (endX - startX) - (x4 - x3) * (endY - startY));
    const uB =
        ((endX - startX) * (startY - y3) - (endY - startY) * (startX - x3)) /
        ((y4 - y3) * (endX - startX) - (x4 - x3) * (endY - startY));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
};

const isLineColliding = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    objects: Array<Prey | Predator>
): boolean => {
    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const left = isLineCollidingHelper(
            startX,
            startY,
            endX,
            endY,
            obj.x,
            obj.y,
            obj.x,
            obj.y + PREY_HEIGHT
        );
        const right = isLineCollidingHelper(
            startX,
            startY,
            endX,
            endY,
            obj.x + PREY_WIDTH,
            obj.y,
            obj.x + PREY_WIDTH,
            obj.y + PREY_HEIGHT
        );
        const top = isLineCollidingHelper(
            startX,
            startY,
            endX,
            endY,
            obj.x,
            obj.y,
            obj.x + PREY_WIDTH,
            obj.y
        );
        const bottom = isLineCollidingHelper(
            startX,
            startY,
            endX,
            endY,
            obj.x,
            obj.y + PREY_HEIGHT,
            obj.x + PREY_WIDTH,
            obj.y + PREY_HEIGHT
        );

        if (left || right || top || bottom) {
            return true;
        }
    }

    return false;
};

export default isLineColliding;
