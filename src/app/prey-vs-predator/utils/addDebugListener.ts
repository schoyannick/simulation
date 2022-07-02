export let isDebugModeEnabled = false;

function addDebugListener() {
    window.addEventListener('keydown', (event) => {
        if (event.key === 'd' || event.key === 'D') {
            isDebugModeEnabled = !isDebugModeEnabled;
        }
    });
}

export default addDebugListener;
