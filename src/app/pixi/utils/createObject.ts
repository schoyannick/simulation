function createPrey(x: number, y: number) {
    const event = new CustomEvent('createPrey', {
        detail: {
            x,
            y,
        },
    });
    window.dispatchEvent(event);
}

function createPredator(x: number, y: number) {
    const event = new CustomEvent('createPredator', {
        detail: {
            x,
            y,
        },
    });
    window.dispatchEvent(event);
}

export { createPrey, createPredator };
