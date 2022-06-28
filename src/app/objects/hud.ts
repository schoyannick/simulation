import Predator from './predator';
import Prey from './prey';

const BAR_X_POSITION = 10;
const BAR_HEIGHT = 20;

class Hud {
    object: Prey | Predator | null = null;

    update(otherObjects: Array<Prey | Predator>): void {
        if (this.object && !otherObjects.find((obj) => obj === this.object)) {
            this.setActiveObject(null);
        }
    }

    private drawHealthbar(ctx: CanvasRenderingContext2D) {
        if (this.object) {
            ctx.rect(BAR_X_POSITION, 10, 80, BAR_HEIGHT);
            ctx.stroke();
            const percentHealth = this.object.energy / this.object.maxEnergy;
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillRect(BAR_X_POSITION, 10, 80 * percentHealth, BAR_HEIGHT);

            ctx.fillStyle = '#000';
            ctx.font = '15px Roboto';
            ctx.textAlign = 'center';
            const text =
                this.object.constructor.name === 'Prey' ? 'Energy' : 'HP';
            ctx.fillText(text, 50, 25);
        }
    }

    drawSplitTimeBar(ctx: CanvasRenderingContext2D) {
        if (this.object) {
            ctx.rect(BAR_X_POSITION, 40, 80, BAR_HEIGHT);
            ctx.stroke();
            const splitTimePercent =
                1 - this.object.splitTimer / this.object.maxSplitTimer;
            ctx.fillStyle =
                this.object.constructor.name === 'Prey'
                    ? 'rgb(0, 255, 0)'
                    : 'rgb(255, 0, 0)';
            ctx.fillRect(BAR_X_POSITION, 40, 80 * splitTimePercent, BAR_HEIGHT);

            ctx.fillStyle = '#000';
            ctx.font = '15px Roboto';
            ctx.textAlign = 'center';
            const text = 'Split';
            ctx.fillText(text, 50, 55);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.object) {
            ctx.beginPath();
            ctx.rect(0, 0, 100, 100);
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.beginPath();
            ctx.rect(0, 0, 100, 100);
            ctx.stroke();

            this.drawHealthbar(ctx);

            this.drawSplitTimeBar(ctx);
        }
    }

    setActiveObject(newObject: Prey | Predator | null) {
        this.object = newObject;
    }
}

export default Hud;
