import * as PIXI from 'pixi.js';
import {
    PREY_HEIGHT,
    PREY_WIDTH,
} from 'src/app/prey-vs-predator/constants/constants';
import { Prey } from './prey';

export class Rays extends PIXI.Graphics {
    update(preys: Array<Prey>) {
        preys.forEach((prey) => {
            prey.rays.forEach(([x, y]) => {
                console.log('AIII');
                const startX = prey.x + PREY_WIDTH / 2;
                const startY = prey.y + PREY_HEIGHT / 2;
                // const isColliding =
                //     isLineColliding(startX, startY, x, y, predators) !== -1;
                const color = false ? 0xff0000 : 0x00ff00;
                this.beginFill();
                this.moveTo(startX, startY);
                this.lineTo(x, y);
                this.endFill();
            });
        });
    }
}
