import * as PIXI from 'pixi.js';
import {
    PREY_HEIGHT,
    PREY_WIDTH,
} from 'src/app/pixi/constants/constants';
import Predator from 'src/app/prey-vs-predator/objects/predator';
import isLineColliding from '../utils/isLineColliding';
import { Prey } from './prey';

export class Rays extends PIXI.Graphics {
    update(
        objects: Array<Prey | Predator>,
        otherObjects: Array<Prey | Predator>
    ) {
        objects.forEach((object) => {
            object.rays.forEach(([x, y]) => {
                const startX = object.x + PREY_WIDTH / 2;
                const startY = object.y + PREY_HEIGHT / 2;
                const isColliding =
                    isLineColliding(startX, startY, x, y, otherObjects) !== -1;
                const color = isColliding ? 0xff0000 : 0x00ff00;
                this.lineStyle(2, color, 1).moveTo(startX, startY).lineTo(x, y);
            });
        });
    }

    clearDrawing() {
        this.clear();
    }
}
