import areCircleColliding from '../utils/areCircleColliding';
import rotateVector from '../utils/rotateVector';

export const PREY_RADIUS = 15;
export const PREY_SPEED = 100;
export const PREY_COLOR = '#03AC12';
export const PREY_MAX_ENERGY = 50;

class Prey {
    x: number;
    y: number;
    vector: Array<number>;
    energy: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.energy = PREY_MAX_ENERGY;

        const randX = Math.random() * 2 - 1;
        const randY = Math.random() * 2 - 1;
        this.vector = [randX, randY];
    }

    update(
        deltaTime: number,
        width: number,
        height: number,
        otherObjects: Array<Prey>
    ): void {
        if (!deltaTime) return;

        this.energy -= 1 / deltaTime;
        if (this.energy <= 0) {
            return;
        }

        const movement = (deltaTime / 1000) * PREY_SPEED;
        const newX = this.x + this.vector[0] * movement;
        const newY = this.y + this.vector[1] * movement;

        if (
            newX < 0 + PREY_RADIUS ||
            newX > width - PREY_RADIUS ||
            newY < 0 + PREY_RADIUS ||
            newY > height - PREY_RADIUS ||
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
        ctx.fillStyle = PREY_COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y, PREY_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export default Prey;
