import * as PIXI from 'pixi.js';
import {
    PREY_HEIGHT,
    PREY_WIDTH,
} from 'src/app/prey-vs-predator/constants/constants';
import { Prey } from './prey';

export class Rays extends PIXI.Graphics {
    update(preys: Array<Prey>) {
        this.clear();
        preys.forEach((prey) => {
            prey.rays.forEach(([x, y]) => {
                const startX = prey.x + PREY_WIDTH / 2;
                const startY = prey.y + PREY_HEIGHT / 2;
                // const isColliding =
                //     isLineColliding(startX, startY, x, y, predators) !== -1;
                const color = false ? 0xff0000 : 0x00ff00;
                this.lineStyle(2, color, 1).moveTo(startX, startY).lineTo(x, y);
            });
        });
    }
}
