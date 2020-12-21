import { convertToHSV, convertHEX2RGB2HSV } from './Converter.js';

export default class ChromaKeyFilter {

    apply(frame) {
        let rgb = [];
        let l = frame.data.length / 4;
        let x = 20;

        let ckHSV = convertHEX2RGB2HSV("ck");
        let ckh = ckHSV[0];

        let hMin = ckh - x;
        let hMax = ckh + x;
        let mode = "normal";

        if (hMin < 0) { hMin = 395 - (x - ckh); mode = "highMin"; }
        if (hMax > 359) { hMax = x - (359 - ckh); mode = "lowMax"; }

        for (let i = 0; i < l; i++) {
            rgb[0] = frame.data[i * 4 + 0];
            rgb[1] = frame.data[i * 4 + 1];
            rgb[2] = frame.data[i * 4 + 2];

            let hsv = convertToHSV(rgb);
            let h = hsv[0];

            // make pixel transparent when in threshhold
            switch (mode) {
                case "normal": if (h >= hMin && h <= hMax) frame.data[i * 4 + 3] = 0;
                    break;
                case "highMin":
                    break;
                case "lowMax":
                    break;
            }
        }
    }
}