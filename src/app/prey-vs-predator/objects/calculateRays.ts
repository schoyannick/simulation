function calculateRays(
    angle: number,
    x: number,
    y: number
): Array<Array<number>> {
    const rays: Array<Array<number>> = [];

    const maxRays = 50;

    for (
        let currentAngle = angle - maxRays / 2;
        currentAngle < angle + maxRays / 2;
        currentAngle = currentAngle + 2
    ) {
        const radiant = -currentAngle * (Math.PI / 180);
        const newX = x + Math.cos(radiant) * 150;
        const newY = y + Math.sin(radiant) * 150;
        rays.push([newX, newY]);
    }

    return rays;
}

export default calculateRays;
