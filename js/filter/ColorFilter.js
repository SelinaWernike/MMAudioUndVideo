import { convertHEX2RGB2HSV, convertRGB_HSV_RGB } from './Converter.js';

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
            rgb = convertRGB_HSV_RGB(rgb, this.cfColorHSV[0]);

            // setting new frame data
            frame.data[i * 4 + 0] = rgb[0];
            frame.data[i * 4 + 1] = rgb[1];
            frame.data[i * 4 + 2] = rgb[2];
        }
    }

    setColor(event) {
        this.cfColorHSV = convertHEX2RGB2HSV(event.target.value);
    }

    getAdditionalInputs() {
        const colorFilterColor = document.createElement("input");
        colorFilterColor.addEventListener("change", this.setColor.bind(this));
        colorFilterColor.setAttribute("type", "color");
        colorFilterColor.setAttribute("value", "#FF00FF");
        colorFilterColor.dispatchEvent(new Event("change"))
        colorFilterColor.className = "pointer"
        return [colorFilterColor]
    }
}