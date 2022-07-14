import {
    PREY_HEIGHT,
    PREY_MAX_ENERGY,
    PREY_SPEED,
    PREY_SPLIT_TIME,
    PREY_WIDTH,
} from '../../pixi/constants/constants';
import Predator from './predator';

class Prey {
    x: number;
    y: number;
    energy = 0;
    image: HTMLImageElement;
    maxEnergy = PREY_MAX_ENERGY;
    isResting = false;
    splitTimer = 0;
    maxSplitTimer = PREY_SPLIT_TIME;

    angle = 0;

    rays: Array<Array<number>> = [];

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.image = image;
    }

    update(
        deltaTime: number,
        width: number,
        height: number,
        predators: Array<Predator>
    ): void {
        if (!deltaTime) return;

        this.energy -= 1 / deltaTime;
        const movement = (deltaTime / 1000) * PREY_SPEED;
        const radiant = -this.angle * (Math.PI / 180);
        const newX = Math.round(this.x + Math.cos(radiant) * movement);
        const newY = Math.round(this.y + Math.sin(radiant) * movement);

        const inThreat = this.isInThreat(newX, newY, predators);

        if (this.energy <= 0 && !this.isResting) {
            this.isResting = true;
            return;
        }

        if (this.isResting && this.energy < this.maxEnergy) {
            if (inThreat && this.energy > this.maxEnergy / 10) {
                this.isResting = false;
            } else {
                this.energy += (1 / deltaTime) * 3;
                return;
            }
        }

        if (this.isResting && this.energy >= this.maxEnergy) {
            this.isResting = false;
        }

        if (
            newX < 0 ||
            newX > width - PREY_WIDTH ||
            newY < 0 ||
            newY > height - PREY_HEIGHT
        ) {
            this.x = Math.min(Math.max(newX, 0), width - PREY_WIDTH);
            this.y = Math.min(Math.max(newY, 0), height - PREY_HEIGHT);
            this.angle = Math.floor(Math.random() * 360);
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    isInThreat(newX: number, newY: number, predators: Array<Predator>) {
        return false;
    }

    draw(ctx: CanvasRenderingContext2D, predators: Array<Predator>): void {}
}

export default Prey;
