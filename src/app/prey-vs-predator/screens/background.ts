const ROWS = 10;

class Background {
    width: number = 0;
    height: number = 0;

    update(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const darkColor = '#769656';
        const lightColor = '#eeeed2';

        const squareSize = Math.ceil(this.height / ROWS);
        const cols = Math.ceil(this.width / squareSize);
        let color = darkColor;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < ROWS; j++) {
                const x = i * squareSize;
                const y = j * squareSize;
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, squareSize, squareSize);
                color = color === darkColor ? lightColor : darkColor;
            }
            color = color === darkColor ? lightColor : darkColor;
        }
    }
}

export default Background;
