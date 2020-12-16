import { convertRGB_HSV_RGB } from './Converter.js';

export default class ColorFilter {

    apply(frame) {
        let r, g, b;
        let rgb = [];

        // getting frame data from context
        let l = frame.data.length / 4;

        for (let i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];

            rgb[0] = r;
            rgb[1] = g;
            rgb[2] = b;

            // converting each pixel from rgb to hsv to rgb
            // converter changes color while in hsv model
            rgb = convertRGB_HSV_RGB(rgb);

            // setting new frame data
            frame.data[i * 4 + 0] = rgb[0];
            frame.data[i * 4 + 1] = rgb[1];
            frame.data[i * 4 + 2] = rgb[2];
        }
    }
}