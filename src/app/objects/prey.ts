import rotateVector from '../utils/rotateVector';

export const PREY_WIDTH = 30;
export const PREY_HEIGHT = 30;
export const PREY_SPEED = 150;
export const PREY_MAX_ENERGY = 50;

class Prey {
    x: number;
    y: number;
    vector: Array<number>;
    energy: number;
    image: HTMLImageElement;

    constructor(x: number, y: number, image: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.image = image;

        this.energy = PREY_MAX_ENERGY;

        const randX = Math.random() * 2 - 1;
        const randY = Math.random() * 2 - 1;
        this.vector = [randX, randY];
    }

    update(
        deltaTime: number,
        width: number,
        height: number,
        otherObjects: Array<Prey>
    ): void {
        if (!deltaTime) return;

        this.energy -= 1 / deltaTime;
        if (this.energy <= 0) {
            return;
        }

        const movement = (deltaTime / 1000) * PREY_SPEED;
        const newX = this.x + this.vector[0] * movement;
        const newY = this.y + this.vector[1] * movement;

        if (
            newX < 0 + PREY_WIDTH ||
            newX > width - PREY_WIDTH ||
            newY < 0 + PREY_HEIGHT ||
            newY > height - PREY_HEIGHT
        ) {
            this.x = Math.min(
                Math.max(this.x + this.vector[0] * movement, PREY_WIDTH),
                width - PREY_WIDTH
            );
            this.y = Math.min(
                Math.max(this.y + this.vector[1] * movement, PREY_HEIGHT),
                height - PREY_HEIGHT
            );

            this.vector = rotateVector(
                this.vector,
                Math.floor(Math.random() * 360)
            );
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, PREY_WIDTH, PREY_HEIGHT);
    }
}

export default Prey;
