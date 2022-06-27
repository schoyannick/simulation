import areObjectsColliding from '../utils/areObjectsColliding';
import destroyObject from '../utils/destroyObject';
import rotateVector from '../utils/rotateVector';
import Prey from './prey';

export const PREDATOR_WIDTH = 30;
export const PREDATOR_HEIGHT = 30;
export const PREDATOR_SPEED = 150;
export const PREDATOR_MAX_ENERGY = 100;
export const PREDATOR_SPLIT_TIME = 50;

class Predator {
    x: number;
    y: number;
    vector: Array<number>;
    energy: number;
    image: HTMLImageElement;
    maxEnergy = PREDATOR_MAX_ENERGY;
    isResting = false;
    splitTimer: number;

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.image = image;

        this.energy = PREDATOR_MAX_ENERGY;
        this.splitTimer = PREDATOR_SPLIT_TIME;

        const randX = Math.random() * 2 - 1;
        const randY = Math.random() * 2 - 1;
        this.vector = [randX, randY];
    }

    update(
        deltaTime: number,
        width: number,
        height: number,
        otherObjects: Array<Predator | Prey>
    ): void {
        if (!deltaTime) return;

        this.energy -= 1 / deltaTime;
        if (this.energy <= 0) {
            destroyObject(this);
            return;
        }

        const movement = (deltaTime / 1000) * PREDATOR_SPEED;
        const newX = this.x + this.vector[0] * movement;
        const newY = this.y + this.vector[1] * movement;

        this.checkForKill(
            newX,
            newY,
            otherObjects.filter((object) => object.constructor.name === 'Prey')
        );

        if (
            newX < 0 ||
            newX > width - PREDATOR_WIDTH ||
            newY < 0 ||
            newY > height - PREDATOR_HEIGHT
        ) {
            this.x = Math.min(
                Math.max(this.x + this.vector[0] * movement, 0),
                width - PREDATOR_WIDTH
            );
            this.y = Math.min(
                Math.max(this.y + this.vector[1] * movement, 0),
                height - PREDATOR_HEIGHT
            );

            this.vector = rotateVector(
                this.vector,
                Math.floor(Math.random() * 360)
            );
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            PREDATOR_WIDTH,
            PREDATOR_HEIGHT
        );
    }

    checkForKill(x: number, y: number, preys: Array<Prey>) {
        let didKill = false;
        preys.forEach((prey) => {
            if (areObjectsColliding(x, y, [prey])) {
                didKill = true;
                destroyObject(prey);
            }
        });

        if (didKill) {
            this.energy = PREDATOR_MAX_ENERGY;
        }
    }
}

export default Predator;
