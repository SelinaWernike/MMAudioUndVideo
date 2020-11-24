export default class RedFilter {

    apply(frame) {
        let r, g, b, rt, gt, bt, h, s, v, j, p, q, t;

        // getting frame data from context
        let l = frame.data.length / 4;

        for (let i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];

            // converting RGB to HSV
            //h is left out because it gets set to a static number
            rt = r / 255;
            gt = g / 255;
            bt = g / 255;
            let cMax = Math.max(rt, Math.max(gt, bt))
            let cMin = Math.min(rt, Math.min(gt, bt));
            let diff = cMax - cMin;

            // changeing hue to red
            h = 0;

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
            }

            r = r * 255;
            g = g * 255;
            b = b * 255;

            frame.data[i * 4 + 0] = Math.round(r);
            frame.data[i * 4 + 1] = Math.round(g);
            frame.data[i * 4 + 2] = Math.round(b);
        }
    }
}