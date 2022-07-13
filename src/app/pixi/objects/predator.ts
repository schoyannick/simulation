import * as PIXI from 'pixi.js';
import {
    PREDATOR_HEIGHT,
    PREDATOR_MAX_ENERGY,
    PREDATOR_SPEED,
    PREDATOR_SPLIT_TIME,
    PREDATOR_WIDTH,
    PREY_HEIGHT,
    PREY_MAX_ENERGY,
    PREY_SPLIT_TIME,
    PREY_WIDTH,
} from 'src/app/prey-vs-predator/constants/constants';
import calculateRays from 'src/app/prey-vs-predator/objects/calculateRays';
import areObjectsColliding from 'src/app/prey-vs-predator/utils/areObjectsColliding';
import getRandomNumberInRange from 'src/app/prey-vs-predator/utils/getRandomNumberInRange';
import isLineColliding from 'src/app/prey-vs-predator/utils/isLineColliding';
import { Prey } from './prey';

export type Predator = PIXI.Sprite & {
    update(
        deltaTime: number,
        width: number,
        height: number,
        preys: Array<Prey>
    ): void;
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
    const moveDirection = Math.floor(Math.random() * 360);
    const imageName =
        moveDirection <= 90 || moveDirection >= 270
            ? 'predatorRight'
            : 'predatorLeft';

    const predator = new PIXI.Sprite(
        spriteSheet.textures[`${imageName}.png`]
    ) as Predator;

    predator.width = PREY_WIDTH;
    predator.height = PREY_HEIGHT;

    predator.energy = getRandomNumberInRange(
        PREY_MAX_ENERGY / 5,
        PREY_MAX_ENERGY
    );
    predator.splitTimer = PREY_SPLIT_TIME;
    predator.moveDirection = moveDirection;

    predator.rays = [];
    predator.maxEnergy = PREY_MAX_ENERGY;
    predator.isResting = false;
    predator.maxSplitTimer = PREY_SPLIT_TIME;

    predator.x = x;
    predator.y = y;

    predator.update = (
        deltaTime: number,
        width: number,
        height: number,
        preys: Array<Prey>
    ) => {
        const prevMoveDirection = predator.moveDirection;

        predator.energy -= 1 / (deltaTime * 16);
        if (predator.energy <= 0) {
            // destroyPredator(predator);
            return;
        }

        if (predator.splitTimer <= 0) {
            const offsetX = Math.random() * 20 - 10;
            const offsety = Math.random() * 20 - 10;
            const x = Math.min(
                Math.max(predator.x + offsetX, PREDATOR_WIDTH),
                width - PREDATOR_WIDTH
            );
            const y = Math.min(
                Math.max(predator.y + offsety, PREDATOR_HEIGHT),
                height - PREDATOR_HEIGHT
            );
            // createPredator(x, y, predator.image);

            predator.splitTimer = PREDATOR_SPLIT_TIME;
        }

        const movement = (deltaTime / 1000) * PREDATOR_SPEED;
        const radiant = -predator.angle * (Math.PI / 180);
        const newX = Math.round(predator.x + Math.cos(radiant) * movement);
        const newY = Math.round(predator.y + Math.sin(radiant) * movement);

        checkForKill(newX, newY, preys);

        predator.rays = calculateRays(predator.angle, newX, newY);

        targetPrey(newX, newY, preys);

        if (
            newX < 0 ||
            newX > width - PREDATOR_WIDTH ||
            newY < 0 ||
            newY > height - PREDATOR_HEIGHT
        ) {
            predator.x = Math.min(Math.max(newX, 0), width - PREDATOR_WIDTH);
            predator.y = Math.min(Math.max(newY, 0), height - PREDATOR_HEIGHT);
            predator.angle = Math.floor(Math.random() * 360);
        } else {
            predator.x = newX;
            predator.y = newY;
        }

        if (prevMoveDirection !== predator.moveDirection) {
            const updatedImage =
                predator.moveDirection <= 90 || predator.moveDirection >= 270
                    ? 'preyRight'
                    : 'preyLeft';

            predator.texture = spriteSheet.textures[`${updatedImage}.png`];
        }
    };

    function targetPrey(newX: number, newY: number, preys: Array<Prey>) {
        for (let i = 0; i < predator.rays.length; i++) {
            const [x, y] = predator.rays[i];
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
                predator.angle = radiant * (180 / Math.PI);
                return;
            }
        }
    }

    function checkForKill(x: number, y: number, preys: Array<Prey>) {
        let killCount = 0;
        preys.forEach((prey) => {
            if (areObjectsColliding(x, y, [prey])) {
                killCount++;
                // destroyPrey(prey);
            }
        });

        if (killCount) {
            predator.energy = PREDATOR_MAX_ENERGY;
            predator.splitTimer -= (PREDATOR_SPLIT_TIME / 3) * killCount;
        }
    }

    return predator;
};

export default getPredator;
