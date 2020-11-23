export default class BWFilter {

    apply(frame) {
        let l = frame.data.length / 4;
        for (let i = 0; i < l; i++) {
            let r = frame.data[i * 4 + 0];
            let g = frame.data[i * 4 + 1];
            let b = frame.data[i * 4 + 2];
    
            //change brightness of each pixel
            var brightness = (3 * r + 4 * g + b) >>> 3;
            frame.data[i * 4 + 0] = brightness;
            frame.data[i * 4 + 1] = brightness;
            frame.data[i * 4 + 2] = brightness;
        }
    }
}