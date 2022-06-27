const rotateVector = (vec: Array<number>, ang: number) => {
    ang = -ang * (Math.PI / 180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Array(
        Math.round(1000 * (vec[0] * cos - vec[1] * sin)) / 1000,
        Math.round(1000 * (vec[0] * sin + vec[1] * cos)) / 1000
    );
};

export default rotateVector;
