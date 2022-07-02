import areObjectsColliding from '../utils/areObjectsColliding';
import { destroyPredator, destroyPrey } from '../utils/destroyObject';
import { createPredator } from '../utils/createObject';
import rotateVector from '../utils/rotateVector';
import Prey from './prey';
import {
    PREDATOR_HEIGHT,
    PREDATOR_MAX_ENERGY,
    PREDATOR_SPEED,
    PREDATOR_SPLIT_TIME,
    PREDATOR_WIDTH,
} from '../constants/constants';

class Predator {
    x: number;
    y: number;
    energy: number;
    image: HTMLImageElement;

    maxEnergy = PREDATOR_MAX_ENERGY;
    splitTimer: number;
    maxSplitTimer = PREDATOR_SPLIT_TIME;

    angle: number;

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.image = image;

        this.energy = PREDATOR_MAX_ENERGY;
        this.splitTimer = PREDATOR_SPLIT_TIME;

        this.angle = Math.floor(Math.random() * 360);
    }

    update(
        deltaTime: number,
        width: number,
        height: number,
        preys: Array<Prey>
    ): void {
        if (!deltaTime) return;

        this.energy -= 1 / deltaTime;
        if (this.energy <= 0) {
            destroyPredator(this);
            return;
        }

        if (this.splitTimer <= 0) {
            const offsetX = Math.random() * 20 - 10;
            const offsety = Math.random() * 20 - 10;
            const x = Math.min(
                Math.max(this.x + offsetX, PREDATOR_WIDTH),
                width - PREDATOR_WIDTH
            );
            const y = Math.min(
                Math.max(this.y + offsety, PREDATOR_HEIGHT),
                height - PREDATOR_HEIGHT
            );
            createPredator(x, y, this.image);

            this.splitTimer = PREDATOR_SPLIT_TIME;
        }

        const movement = (deltaTime / 1000) * PREDATOR_SPEED;
        const radiant = -this.angle * (Math.PI / 180);
        const newX = this.x + Math.cos(radiant) * movement;
        const newY = this.y + Math.sin(radiant) * movement;

        this.checkForKill(newX, newY, preys);

        if (
            newX < 0 ||
            newX > width - PREDATOR_WIDTH ||
            newY < 0 ||
            newY > height - PREDATOR_HEIGHT
        ) {
            this.x = Math.min(Math.max(newX, 0), width - PREDATOR_WIDTH);
            this.y = Math.min(Math.max(newY, 0), height - PREDATOR_HEIGHT);
            this.angle = Math.floor(Math.random() * 360);
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
        let killCount = 0;
        preys.forEach((prey) => {
            if (areObjectsColliding(x, y, [prey])) {
                killCount++;
                destroyPrey(prey);
            }
        });

        if (killCount) {
            this.energy = PREDATOR_MAX_ENERGY;
            this.splitTimer -= (PREDATOR_SPLIT_TIME / 3) * killCount;
        }
    }
}

export default Predator;
