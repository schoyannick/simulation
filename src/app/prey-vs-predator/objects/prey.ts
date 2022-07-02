import {
    PREY_HEIGHT,
    PREY_MAX_ENERGY,
    PREY_SPEED,
    PREY_SPLIT_TIME,
    PREY_WIDTH,
} from '../constants/constants';
import { isDebugModeEnabled } from '../utils/addDebugListener';
import { createPrey } from '../utils/createObject';
import isLineColliding from '../utils/isLineColliding';
import calculateRays from './calculateRays';
import Predator from './predator';

class Prey {
    x: number;
    y: number;
    energy: number;
    image: HTMLImageElement;
    maxEnergy = PREY_MAX_ENERGY;
    isResting = false;
    splitTimer: number;
    maxSplitTimer = PREY_SPLIT_TIME;

    angle: number;

    rays: Array<Array<number>> = [];

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.image = image;

        this.energy = PREY_MAX_ENERGY;
        this.splitTimer = PREY_SPLIT_TIME;

        this.angle = Math.floor(Math.random() * 360);
    }

    update(
        deltaTime: number,
        width: number,
        height: number,
        predators: Array<Predator>
    ): void {
        if (!deltaTime) return;

        this.handleSplit(deltaTime, width, height);

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
        const radiant = -this.angle * (Math.PI / 180);
        const newX = this.x + Math.cos(radiant) * movement;
        const newY = this.y + Math.sin(radiant) * movement;

        this.rays = calculateRays(this.angle, newX, newY);

        if (this.isInThreat(newX, newY, predators)) {
            this.angle += 180 % 360;
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
        return this.rays.some(([x, y]) => {
            const startX = newX + PREY_WIDTH / 2;
            const startY = newY + PREY_HEIGHT / 2;
            return isLineColliding(startX, startY, x, y, predators) !== -1;
        });
    }

    draw(ctx: CanvasRenderingContext2D, predators: Array<Predator>): void {
        ctx.drawImage(this.image, this.x, this.y, PREY_WIDTH, PREY_HEIGHT);

        if (isDebugModeEnabled) {
            this.rays.forEach(([x, y]) => {
                ctx.beginPath();
                const startX = this.x + PREY_WIDTH / 2;
                const startY = this.y + PREY_HEIGHT / 2;
                const isColliding =
                    isLineColliding(startX, startY, x, y, predators) !== -1;
                ctx.strokeStyle = isColliding
                    ? 'rgb(255, 0,0)'
                    : 'rgb(0,255,0)';
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.stroke();
            });
        }
    }

    handleSplit(deltaTime: number, width: number, height: number) {
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
    }
}

export default Prey;
