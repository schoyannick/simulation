class StartScreen {
    startButton = {
        x: 0,
        y: 0,
        width: 200,
        height: 100,
    };

    update(width: number, height: number) {
        this.startButton.x = width / 2 - 100;
        this.startButton.y = height / 2 - 50;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.font = '35px Roboto';
        ctx.textAlign = 'center';

        ctx.fillText('Prey Vs Predator', width / 2, 100);

        // Start button
        ctx.rect(
            this.startButton.x,
            this.startButton.y,
            this.startButton.width,
            this.startButton.height
        );
        ctx.fillText('START', width / 2, height / 2 + 10);
        ctx.stroke();
    }
}

export default StartScreen;
