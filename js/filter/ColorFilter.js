import { convertRGB_HSV_RGB } from './Converter.js';

/**
 * changeing hue value in each pixel per frame to fit selected color hue
 */
export default class ColorFilter {

    apply(frame) {
        let rgb = [];

        // getting frame data from context
        let l = frame.data.length / 4;

        for (let i = 0; i < l; i++) {
            rgb[0] = frame.data[i * 4 + 0];
            rgb[1] = frame.data[i * 4 + 1];
            rgb[2] = frame.data[i * 4 + 2];

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