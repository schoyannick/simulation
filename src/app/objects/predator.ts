import areCircleColliding from '../utils/areCircleColliding';
import rotateVector from '../utils/rotateVector';
import Prey from './prey';

export const PREDATOR_RADIUS = 15;
export const PREDATOR_SPEED = 100;
export const PREDATOR_COLOR = '#D21404';

class Predator {
    x: number;
    y: number;
    vector: Array<number>;
    energy: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.energy = 100;

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

        this.energy -= 1;
        if (this.energy <= 0) {
        }

        const movement = (deltaTime / 1000) * PREDATOR_SPEED;
        const newX = this.x + this.vector[0] * movement;
        const newY = this.y + this.vector[1] * movement;

        if (
            newX < 0 + PREDATOR_RADIUS ||
            newX > width - PREDATOR_RADIUS ||
            newY < 0 + PREDATOR_RADIUS ||
            newY > height - PREDATOR_RADIUS ||
            areCircleColliding(newX, newY, otherObjects)
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
}

export default Predator;
