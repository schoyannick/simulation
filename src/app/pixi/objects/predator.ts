import * as PIXI from 'pixi.js';
import {
    PREY_HEIGHT,
    PREY_MAX_ENERGY,
    PREY_SPEED,
    PREY_SPLIT_TIME,
    PREY_WIDTH,
} from 'src/app/prey-vs-predator/constants/constants';
import getRandomNumberInRange from 'src/app/prey-vs-predator/utils/getRandomNumberInRange';
import isLineColliding from 'src/app/prey-vs-predator/utils/isLineColliding';

export type Predator = PIXI.Sprite & {
    update(deltaTime: number, width: number, height: number): void;
    moveDirection: number;
    energy: number;
    maxEnergy: number;
    isResting: boolean;
    splitTimer: number;
    maxSplitTimer: number;
    rays: Array<Array<number>>;
};

const getPredator = (
    x: number,
    y: number,
    spriteSheet: PIXI.Spritesheet
): Predator => {
    const predator = PIXI.Sprite.from('/assets/prey.png') as Predator;

    return predator;
};

export default getPredator;
