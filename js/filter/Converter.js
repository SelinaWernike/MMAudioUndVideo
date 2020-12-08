// converts from rgb to hsv and back to rgb
// hue of color gets changed
// requires rgb values and a color string to determine h
// returns array of rgb values

export function RGBHSVConverter(r, g, b, color) {
    let rt, gt, bt, h, s, v, j, p, q, t;
    let rgb = [];

    // converting RGB to HSV
    //h is left out because it gets set to a static number
    rt = r / 255;
    gt = g / 255;
    bt = b / 255;

    let cMax = Math.max(rt, Math.max(gt, bt))
    let cMin = Math.min(rt, Math.min(gt, bt));
    let diff = cMax - cMin;

    // changeing hue to red, green or blue
    switch (color) {
        case 'r':
            h = 0;
            break;
        case 'g':
            h = 122;
            break;
        case 'b':
            h = 220;
            break;
    }

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