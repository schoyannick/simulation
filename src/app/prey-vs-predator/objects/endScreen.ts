class EndScreen {
    restartButton = {
        x: 0,
        y: 0,
        width: 200,
        height: 100,
    };

    winner = '';

    update(width: number, height: number, winner: string) {
        this.restartButton.x = width / 2 - 100;
        this.restartButton.y = height / 2 - 50;

        this.winner = winner;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.font = '35px Roboto';
        ctx.textAlign = 'center';

        ctx.fillText(`${this.winner} WON`, width / 2, 100);

        // Start button
        ctx.rect(
            this.restartButton.x,
            this.restartButton.y,
            this.restartButton.width,
            this.restartButton.height
        );
        ctx.fillText('RESTART', width / 2, height / 2 + 10);
        ctx.stroke();
    }
}

export default EndScreen;
