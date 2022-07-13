import * as PIXI from 'pixi.js';

const ROWS = 10;

export class Background extends PIXI.Graphics {
    update(width: number, height: number) {
        const darkColor = 0x769656;
        const lightColor = 0xeeeed2;

        const squareSize = Math.ceil(height / ROWS);
        const cols = Math.ceil(width / squareSize);
        let color = darkColor;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < ROWS; j++) {
                this.beginFill(color);
                const x = i * squareSize;
                const y = j * squareSize;
                this.drawRect(x, y, squareSize, squareSize);
                this.endFill();
                color = color === darkColor ? lightColor : darkColor;
            }
            color = color === darkColor ? lightColor : darkColor;
        }
    }
}
