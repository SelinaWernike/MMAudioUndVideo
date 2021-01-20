import { convertHEX2RGB2HSV, convertToHSV } from './Converter.js';

/**
 * checks if hue value of all pixels in a frame fit in threshhold of picked color hue
 * if they do, alpha value gets changed to 0
 */
export default class ChromaKeyFilter {

    constructor() {
        this.bgImage = document.querySelector("#backgroundImgCanvas")
    }

    apply(frame) {
        let rgb = [];
        let hsv = [];
        let l = frame.data.length / 4;
        let x = 20;
        let ckh = this.ckColorHSV[0];
        let h = 0;

        let hMin = ckh - x;
        let hMax = ckh + x;
        var mode = 1;

        // needed to handle overflow of hue values
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

    setColor(event) {
        this.ckColorHSV = convertHEX2RGB2HSV(event.target.value);
    }

    setBackgroundImage(event) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            this.bgImage.src = e.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    getAdditionalInputs() {
        const ckFilterColor = document.createElement("input");
        ckFilterColor.addEventListener("change", this.setColor.bind(this))
        ckFilterColor.setAttribute("type", "color");
        ckFilterColor.setAttribute("value", "#00FF00");
        ckFilterColor.dispatchEvent(new Event("change"))
        ckFilterColor.className = "pointer"
        const bgImageInput = document.createElement("input")
        bgImageInput.setAttribute("type", "file")
        bgImageInput.setAttribute("accept", "image/*")
        bgImageInput.setAttribute("hidden", "")
        bgImageInput.addEventListener("change", this.setBackgroundImage.bind(this))
        const bgImageIcon = document.createElement("img")
        bgImageIcon.setAttribute("src", "./images/bgImage_white.png")
        bgImageIcon.setAttribute("width", 40)
        bgImageIcon.setAttribute("height", 24)
        bgImageIcon.className = "pointer"
        bgImageIcon.addEventListener("click", () => {
            bgImageInput.click();
        })
        return [ckFilterColor, bgImageInput, bgImageIcon]
    }


}