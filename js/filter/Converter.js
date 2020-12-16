var cfColor = document.getElementById("colorFilterColor");
var cfColorHEX = cfColor.value;
var ckColor = document.getElementById("ckFilterColor");
var ckColorHEX = ckColor.value;
var colorHSV = convertHEX2RGB2HSV("cf");

// converts from rgb to hsv and back to rgb
// hue of color gets changed
// returns array of rgb values
export function convertRGB_HSV_RGB(rgb) {
    let rt, gt, bt, h, s, v, j, p, q, t, r, g, b;
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];

    // converting RGB to HSV
    rt = r / 255;
    gt = g / 255;
    bt = b / 255;

    let cMax = Math.max(rt, Math.max(gt, bt))
    let cMin = Math.min(rt, Math.min(gt, bt));
    let diff = cMax - cMin;

    h = colorHSV[0];

    if (cMax == 0) { s = 0; }
    else { s = (diff / cMax) * 100; }

    v = cMax * 100;

    // converting HSV to RGB
    h = h / 360;
    s = s / 100;
    v = v / 100;

    if (s == 0) {
        r = v * 255;
        g = v * 255;
        b = v * 255;

    } else {
        h = h * 6;
        j = Math.floor(h);
        p = v * (1 - s);
        q = v * (1 - s * (h - j));
        t = v * (1 - s * (1 - (h - j)));

        switch (j) {
            case 0: r = v; g = t; b = p;
                break;
            case 1: r = q; g = v; b = p;
                break;
            case 2: r = p; g = v; b = t;
                break;
            case 3: r = p; g = q; b = v;
                break;
            case 4: r = t; g = p; b = v;
                break;
            default: r = v; g = p; b = q;
                break;
        }

        r = r * 255;
        g = g * 255;
        b = b * 255;
    }

    rgb[0] = Math.round(r);
    rgb[1] = Math.round(g);
    rgb[2] = Math.round(b);

    return rgb;
}

export function convertToHSV(rgb) {
    let h, s, v, r, g, b, rt, gt, bt;
    let hsv = [];

    // converting RGB to HSV
    rt = rgb[0] / 255;
    gt = rgb[1] / 255;
    bt = rgb[2] / 255;

    let cMax = Math.max(rt, Math.max(gt, bt))
    let cMin = Math.min(rt, Math.min(gt, bt));
    let diff = cMax - cMin;
    v = cMax;

    if (diff == 0) {
        h = 0;
        s = 0;
    } else {
        s = diff / cMax;
        r = (((cMax - rt) / 6) + (diff / 2)) / diff;
        g = (((cMax - gt) / 6) + (diff / 2)) / diff;
        b = (((cMax - bt) / 6) + (diff / 2)) / diff;

        if (r == cMax) { h = b - gt; }
        else if (g == cMax) { h = (1 / 3) + r - b; }
        else if (b == cMax) { h = (1 / 3) + g - r; }

        if (h < 0) { h += 1; }
        if (h > 1) { h -= 1; }
    }

    hsv[0] = Math.round(h * 360);
    hsv[1] = Math.round(s * 100);
    hsv[2] = Math.round(v * 100);

    console.log(hsv[0]);

    return hsv;
}

export function convertHEX2RGB2HSV(filter) {
    let rgb = [];
    var hex = "#000000";

    switch (filter) {
        case "cf": hex = cfColorHEX; break;
        case "ck": hex = ckColorHEX; break;
    }

    if (hex.charAt(0) === '#') {
        hex = hex.substr(1);
    }

    var values = hex.split(''),
        r, g, b;

    r = parseInt(values[0].toString() + values[1].toString(), 16);
    g = parseInt(values[2].toString() + values[3].toString(), 16);
    b = parseInt(values[4].toString() + values[5].toString(), 16);

    rgb[0] = r;
    rgb[1] = g;
    rgb[2] = b;

    console.log(r,g,b);

    return convertToHSV(rgb);
}

cfColor.addEventListener("change", function () {
    cfColorHEX = cfColor.value;
    colorHSV = convertHEX2RGB2HSV("cf");
}, false);

ckColor.addEventListener("change", function () {
    ckColorHEX = ckColor.value;
}, false);