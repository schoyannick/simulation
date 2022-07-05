import {
    PREDATOR_SPRITE_SHEET_POS,
    PREY_SPRITE_SHEET_POS,
} from '../constants/constants';

class StartScreen {
    startButton = {
        x: 0,
        y: 0,
        width: 200,
        height: 100,
    };

    spriteSheet: HTMLImageElement | null = null;

    update(width: number, height: number) {
        this.startButton.x = width / 2 - 100;
        this.startButton.y = height / 2 - 50;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        if (!this.spriteSheet) return;

        ctx.strokeStyle = '#000000';
        ctx.font = 'bolder 40px Roboto';
        ctx.textAlign = 'start';

        const itemHeight = Math.min(Math.max(width / 10, 30), 200);

        // Prey sprite
        const preyPos = PREY_SPRITE_SHEET_POS.right;
        ctx.drawImage(
            this.spriteSheet,
            preyPos.x,
            preyPos.y,
            preyPos.width,
            preyPos.height,
            itemHeight,
            100,
            itemHeight,
            itemHeight
        );
        // Prey text
        // ctx.fillText('PREY', itemHeight, 150 + itemHeight);

        const predatorPos = PREDATOR_SPRITE_SHEET_POS.left;
        ctx.drawImage(
            this.spriteSheet,
            predatorPos.x,
            predatorPos.y,
            predatorPos.width,
            predatorPos.height,
            width - itemHeight * 2,
            100,
            itemHeight,
            itemHeight
        );

        // ctx.fillStyle = '#1c4966';
        const text = 'Prey Vs Predator';
        ctx.fillText(text, width / 2 - ctx.measureText(text).width / 2, 100);
        ctx.stroke();

        // Start button
        ctx.rect(
            this.startButton.x,
            this.startButton.y,
            this.startButton.width,
            this.startButton.height
        );
        ctx.textAlign = 'center';
        ctx.fillText('START', width / 2, height / 2 + 10);
        ctx.stroke();
    }
}

export default StartScreen;
