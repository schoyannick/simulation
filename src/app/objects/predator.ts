import areObjectsColliding from '../utils/areObjectsColliding';
import rotateVector from '../utils/rotateVector';
import Prey from './prey';

export const PREDATOR_WIDTH = 30;
export const PREDATOR_HEIGHT = 30;
export const PREDATOR_SPEED = 150;
export const PREDATOR_MAX_ENERGY = 50;

class Predator {
    x: number;
    y: number;
    vector: Array<number>;
    energy: number;
    image: HTMLImageElement;

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.image = image;

        this.energy = PREDATOR_MAX_ENERGY;

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
            const event = new CustomEvent('destroy', {
                detail: this,
            });
            window.dispatchEvent(event);
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
            newX < 0 + PREDATOR_WIDTH ||
            newX > width - PREDATOR_WIDTH ||
            newY < 0 + PREDATOR_HEIGHT ||
            newY > height - PREDATOR_HEIGHT
        ) {
            this.x = Math.min(
                Math.max(this.x + this.vector[0] * movement, PREDATOR_WIDTH),
                width - PREDATOR_WIDTH
            );
            this.y = Math.min(
                Math.max(this.y + this.vector[1] * movement, PREDATOR_HEIGHT),
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
                const event = new CustomEvent('destroy', {
                    detail: prey,
                });
                window.dispatchEvent(event);
            }
        });

        if (didKill) {
            this.energy = PREDATOR_MAX_ENERGY;
        }
    }
}

export default Predator;
