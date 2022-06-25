import areCircleColliding from '../utils/areCircleColliding';
import rotateVector from '../utils/rotateVector';
import Prey from './prey';

export const PREDATOR_RADIUS = 15;
export const PREDATOR_SPEED = 100;
export const PREDATOR_COLOR = '#D21404';
export const PREDATOR_MAX_ENERGY = 50;

class Predator {
    x: number;
    y: number;
    vector: Array<number>;
    energy: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

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
            newX < 0 + PREDATOR_RADIUS ||
            newX > width - PREDATOR_RADIUS ||
            newY < 0 + PREDATOR_RADIUS ||
            newY > height - PREDATOR_RADIUS ||
            areCircleColliding(
                newX,
                newY,
                otherObjects.filter(
                    (object) => object.constructor.name === 'Predator'
                )
            )
        ) {
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
        ctx.fillStyle = PREDATOR_COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y, PREDATOR_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }

    checkForKill(x: number, y: number, preys: Array<Prey>) {
        let didKill = false;
        preys.forEach((prey) => {
            if (areCircleColliding(x, y, [prey])) {
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
