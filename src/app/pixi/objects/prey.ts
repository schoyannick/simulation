import * as PIXI from 'pixi.js';
import {
    PREY_HEIGHT,
    PREY_MAX_ENERGY,
    PREY_SPEED,
    PREY_SPLIT_TIME,
    PREY_WIDTH,
} from 'src/app/prey-vs-predator/constants/constants';
import calculateRays from 'src/app/prey-vs-predator/objects/calculateRays';
import getRandomNumberInRange from 'src/app/prey-vs-predator/utils/getRandomNumberInRange';
import isLineColliding from 'src/app/prey-vs-predator/utils/isLineColliding';
import { Predator } from './predator';

export type Prey = PIXI.Sprite & {
    update(
        deltaTime: number,
        width: number,
        height: number,
        predators: Array<Predator>
    ): void;
    moveDirection: number;
    energy: number;
    maxEnergy: number;
    isResting: boolean;
    splitTimer: number;
    maxSplitTimer: number;
    rays: Array<Array<number>>;
};

const getPrey = (x: number, y: number, spriteSheet: PIXI.Spritesheet): Prey => {
    const moveDirection = Math.floor(Math.random() * 360);
    const imageName =
        moveDirection <= 90 || moveDirection >= 270 ? 'preyRight' : 'preyLeft';

    const prey = new PIXI.Sprite(
        spriteSheet.textures[`${imageName}.png`]
    ) as Prey;

    prey.width = PREY_WIDTH;
    prey.height = PREY_HEIGHT;

    prey.energy = getRandomNumberInRange(PREY_MAX_ENERGY / 5, PREY_MAX_ENERGY);
    prey.splitTimer = PREY_SPLIT_TIME;
    prey.moveDirection = moveDirection;

    prey.rays = [];
    prey.maxEnergy = PREY_MAX_ENERGY;
    prey.isResting = false;
    prey.maxSplitTimer = PREY_SPLIT_TIME;

    prey.x = x;
    prey.y = y;

    function handleSplit(deltaTime: number, width: number, height: number) {
        prey.splitTimer -= 1 / deltaTime;
        if (prey.splitTimer <= 0) {
            const offsetX = Math.random() * 20 - 10;
            const offsety = Math.random() * 20 - 10;
            const x = Math.min(
                Math.max(prey.x + offsetX, PREY_WIDTH),
                width - PREY_WIDTH
            );
            const y = Math.min(
                Math.max(prey.y + offsety, PREY_HEIGHT),
                height - PREY_HEIGHT
            );
            // createPrey(x, y, prey.image);

            prey.splitTimer = PREY_SPLIT_TIME;
        }
    }

    function isInThreat(
        newX: number,
        newY: number,
        predators: Array<Predator>
    ) {
        return prey.rays.some(([x, y]) => {
            const startX = newX + PREY_WIDTH / 2;
            const startY = newY + PREY_HEIGHT / 2;
            return isLineColliding(startX, startY, x, y, predators) !== -1;
        });
    }

    prey.update = (
        deltaTime: number,
        width: number,
        height: number,
        predators: Array<Predator>
    ) => {
        const prevMoveDirection = prey.moveDirection;
        handleSplit(deltaTime, width, height);

        prey.energy -= 1 / (deltaTime * 16);
        const movement = (deltaTime / 60) * PREY_SPEED;
        const radiant = -prey.moveDirection * (Math.PI / 180);
        const newX = Math.round(prey.x + Math.cos(radiant) * movement);
        const newY = Math.round(prey.y + Math.sin(radiant) * movement);

        const inThreat = isInThreat(newX, newY, predators);

        if (prey.energy <= 0 && !prey.isResting) {
            prey.isResting = true;
            return;
        }

        if (prey.isResting && prey.energy < prey.maxEnergy) {
            if (inThreat && prey.energy > prey.maxEnergy / 10) {
                prey.isResting = false;
            } else {
                prey.energy += (1 / deltaTime) * 3;
                return;
            }
        }

        if (prey.isResting && prey.energy >= prey.maxEnergy) {
            prey.isResting = false;
        }

        prey.rays = calculateRays(prey.moveDirection, newX, newY);

        if (inThreat) {
            // 0 -> right = 90 or 270
            // 90 -> top = 0 or 180
            // 180 -> left = 90 or 270
            // 270 -> bottom = 180 or 0
            const useLowerRange = Math.random() >= 0.5;
            if (prey.moveDirection <= 45 || prey.moveDirection >= 315) {
                if (useLowerRange) {
                    prey.moveDirection = getRandomNumberInRange(45, 135);
                } else {
                    prey.moveDirection = getRandomNumberInRange(225, 315);
                }
            } else if (prey.moveDirection >= 45 && prey.moveDirection <= 135) {
                if (useLowerRange) {
                    if (Math.random() >= 0.5) {
                        prey.moveDirection = getRandomNumberInRange(315, 360);
                    } else {
                        prey.moveDirection = getRandomNumberInRange(0, 45);
                    }
                } else {
                    prey.moveDirection = getRandomNumberInRange(225, 315);
                }
            } else if (prey.moveDirection >= 135 && prey.moveDirection <= 225) {
                if (useLowerRange) {
                    prey.moveDirection = getRandomNumberInRange(45, 135);
                } else {
                    prey.moveDirection = getRandomNumberInRange(225, 315);
                }
            } else {
                if (useLowerRange) {
                    if (Math.random() >= 0.5) {
                        prey.moveDirection = getRandomNumberInRange(315, 360);
                    } else {
                        prey.moveDirection = getRandomNumberInRange(0, 45);
                    }
                } else {
                    prey.moveDirection = getRandomNumberInRange(225, 315);
                }
            }
        }

        if (
            newX < 0 ||
            newX > width - PREY_WIDTH ||
            newY < 0 ||
            newY > height - PREY_HEIGHT
        ) {
            prey.x = Math.min(Math.max(newX, 0), width - PREY_WIDTH);
            prey.y = Math.min(Math.max(newY, 0), height - PREY_HEIGHT);
            prey.moveDirection = Math.floor(Math.random() * 360);
        } else {
            prey.position.set(newX, newY);
        }

        if (prevMoveDirection !== prey.moveDirection) {
            const updatedImage =
                prey.moveDirection <= 90 || prey.moveDirection >= 270
                    ? 'preyRight'
                    : 'preyLeft';

            prey.texture = spriteSheet.textures[`${updatedImage}.png`];
        }
    };

    return prey;
};

export default getPrey;
