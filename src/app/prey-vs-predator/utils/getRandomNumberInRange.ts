function getRandomNumberInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default getRandomNumberInRange;
