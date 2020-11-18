export default class RedFilter {

    apply(frame) {
        let r, g, b, h, s, v, j, f, p, q, t;

        // getting frame data from context
        let l = frame.data.length / 4;

        for (let i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];

            // converting RGB to HSV
            //h is left out because it gets set to a static number
            r = r / 255;
            g = g / 255;
            b = g / 255;
            let cMax = Math.max(r, g, b)
            let cMin = Math.min(r, g, b);
            let cDiff = cMax - cMin;

            // changeing hue to red
            h = 0;

            if (cMax === 0) { s = 0; }
            else { s = (cDiff / cMax) * 100; }

            v = cMax * 100;

            // converting HSV to RGB
            j = Math.floor(h * 6);
            f = h * 6 - j;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (j % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }

            frame.data[i * 4 + 0] = Math.round(r * 255);
            frame.data[i * 4 + 1] = Math.round(g * 255);
            frame.data[i * 4 + 2] = Math.round(b * 255);
        }
    }
}