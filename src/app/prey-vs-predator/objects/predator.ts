import Prey from './prey';
import {
    PREDATOR_HEIGHT,
    PREDATOR_MAX_ENERGY,
    PREDATOR_SPEED,
    PREDATOR_SPLIT_TIME,
    PREDATOR_WIDTH,
} from '../../pixi/constants/constants';
import isLineColliding from 'src/app/pixi/utils/isLineColliding';

class Predator {
    x: number;
    y: number;
    energy: number;
    image: HTMLImageElement;

    maxEnergy = PREDATOR_MAX_ENERGY;
    splitTimer: number;
    maxSplitTimer = PREDATOR_SPLIT_TIME;

    angle: number;

    rays: Array<Array<number>> = [];

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
    }

    draw(ctx: CanvasRenderingContext2D, preys: Array<Prey>): void {}

    targetPrey(newX: number, newY: number, preys: Array<Prey>) {
        for (let i = 0; i < this.rays.length; i++) {
            const [x, y] = this.rays[i];
            const startX = newX + PREDATOR_WIDTH / 2;
            const startY = newY + PREDATOR_HEIGHT / 2;
            const collidingIndex = isLineColliding(startX, startY, x, y, preys);

            if (collidingIndex > -1) {
                let radiant = Math.atan2(
                    preys[collidingIndex].y - newY,
                    preys[collidingIndex].x - newX
                );
                if (radiant < 0) {
                    radiant = Math.abs(radiant);
                } else {
                    radiant = 2 * Math.PI - radiant;
                }
                this.angle = radiant * (180 / Math.PI);
                return;
            }
        }
    }

    checkForKill(x: number, y: number, preys: Array<Prey>) {
        let killCount = 0;
    }
}

export default Predator;
