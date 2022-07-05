const ROWS = 10;
const COLS = 10;

class Background {
    width: number = 0;
    height: number = 0;

    update(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const darkColor = '	#d3d3d3';
        const lightColor = '#777B7E';

        const row = Math.ceil(this.height / ROWS);
        const col = Math.ceil(this.width / COLS);
        let color = darkColor;

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                const x = i * col;
                const y = j * row;
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, col, row);
                color = color === darkColor ? lightColor : darkColor;
            }
            color = color === darkColor ? lightColor : darkColor;
        }
    }
}

export default Background;
