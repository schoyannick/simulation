import Predator from './predator';
import Prey from './prey';

class Hud {
    object: Prey | Predator | null = null;

    update(otherObjects: Array<Prey | Predator>): void {
        if (this.object && !otherObjects.find((obj) => obj === this.object)) {
            this.setActiveObject(null);
        }
    }

    private drawHealthbar(ctx: CanvasRenderingContext2D) {
        if (this.object) {
            ctx.rect(10, 10, 80, 20);
            ctx.stroke();
            const percentHealth = this.object.energy / this.object.maxEnergy;
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillRect(10, 10, 80 * percentHealth, 20);

            ctx.fillStyle = '#000';
            ctx.font = '15px Roboto';
            ctx.textAlign = 'center';
            const text =
                this.object.constructor.name === 'Prey' ? 'Energy' : 'HP';
            ctx.fillText(text, 50, 25);
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
        }
    }

    setActiveObject(newObject: Prey | Predator | null) {
        this.object = newObject;
    }
}

export default Hud;
