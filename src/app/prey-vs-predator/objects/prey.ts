import { createPrey } from '../utils/createObject';
import rotateVector from '../utils/rotateVector';

export const PREY_WIDTH = 30;
export const PREY_HEIGHT = 30;
export const PREY_SPEED = 150;
export const PREY_MAX_ENERGY = 80;
export const PREY_SPLIT_TIME = 10;

class Prey {
    x: number;
    y: number;
    vector: Array<number>;
    energy: number;
    image: HTMLImageElement;
    maxEnergy = PREY_MAX_ENERGY;
    isResting = false;
    splitTimer: number;
    maxSplitTimer = PREY_SPLIT_TIME;

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.image = image;

        this.energy = PREY_MAX_ENERGY;
        this.splitTimer = PREY_SPLIT_TIME;

        const randX = Math.random() * 2 - 1;
        const randY = Math.random() * 2 - 1;
        this.vector = [randX, randY];
    }

    update(deltaTime: number, width: number, height: number): void {
        if (!deltaTime) return;

        this.splitTimer -= 1 / deltaTime;
        if (this.splitTimer <= 0) {
            const offsetX = Math.random() * 20 - 10;
            const offsety = Math.random() * 20 - 10;
            const x = Math.min(
                Math.max(this.x + offsetX, PREY_WIDTH),
                width - PREY_WIDTH
            );
            const y = Math.min(
                Math.max(this.y + offsety, PREY_HEIGHT),
                height - PREY_HEIGHT
            );
            createPrey(x, y, this.image);

            this.splitTimer = PREY_SPLIT_TIME;
        }

        if (this.energy <= 0 && !this.isResting) {
            this.isResting = true;
            return;
        }

        if (this.isResting && this.energy < this.maxEnergy) {
            this.energy += 1 / deltaTime;
            return;
        }

        if (this.isResting && this.energy >= this.maxEnergy) {
            this.isResting = false;
        }

        this.energy -= 1 / deltaTime;

        const movement = (deltaTime / 1000) * PREY_SPEED;
        const newX = this.x + this.vector[0] * movement;
        const newY = this.y + this.vector[1] * movement;

        if (
            newX < 0 ||
            newX > width - PREY_WIDTH ||
            newY < 0 ||
            newY > height - PREY_HEIGHT
        ) {
            this.x = Math.min(
                Math.max(this.x + this.vector[0] * movement, 0),
                width - PREY_WIDTH
            );
            this.y = Math.min(
                Math.max(this.y + this.vector[1] * movement, 0),
                height - PREY_HEIGHT
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
        ctx.drawImage(this.image, this.x, this.y, PREY_WIDTH, PREY_HEIGHT);
    }
}

export default Prey;
