import { convertToHSV, ckColorHSV } from './Converter.js';

export default class ChromaKeyFilter {

    apply(frame) {
        let rgb = [];
        let hsv = [];
        let l = frame.data.length / 4;
        let x = 20;
        let ckh = ckColorHSV[0];
        let h = 0;

        let hMin = ckh - x;
        let hMax = ckh + x;
        var mode = 1;

        if (hMin < 0) { hMin = 395 - (x - ckh); mode = 2; }
        if (hMax > 359) { hMax = x - (359 - ckh); mode = 2; }

        for (let i = 0; i < l; i++) {
            rgb[0] = frame.data[i * 4 + 0];
            rgb[1] = frame.data[i * 4 + 1];
            rgb[2] = frame.data[i * 4 + 2];

            hsv = convertToHSV(rgb);
            h = hsv[0];

            // make pixel transparent when in threshhold
            if (mode == 1) {
                if (h >= hMin && h <= hMax) frame.data[i * 4 + 3] = 0;
            } else if (mode == 2) {
                if (h <= hMax || h >= hMin) frame.data[i * 4 + 3] = 0;
            }
        }
    }
}