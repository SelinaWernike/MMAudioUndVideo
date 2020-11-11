function chromakey() {
    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");
    let frame = context.getImageData(0, 0, width, heigth);
    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
        let g = frame.data[i * 4 + 1];

        if (g > 100) frame.data[i * 4 + 1] = 0;
    }
    return frame;
}

function drawBWfilter() {
    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");
    let frame = context.getImageData(0, 0, width, heigth);
    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];

        var brightness = (3 * r + 4 * g + b) >>> 3;
        frame.data[i * 4 + 0] = brightness;
        frame.data[i * 4 + 1] = brightness;
        frame.data[i * 4 + 2] = brightness;
    }
    return frame;
}