export default class SepiaFilter {

    apply(frame) {
        let l = frame.data.length / 4;
        for (let i = 0; i < l; i++) {
            let r = frame.data[i * 4 + 0];
            let g = frame.data[i * 4 + 1];
            let b = frame.data[i * 4 + 2];

            // math for transformative rgb values
            let tr = 0.393 * r + 0.769 * g + 0.189 * b;
            let tg = 0.349 * r + 0.686 * g + 0.168 * b;
            let tb = 0.272 * r + 0.534 * g + 0.131 * b;

            if (tr > 255) { frame.data[i * 4 + 0] = 255 } else { frame.data[i * 4 + 0] = tr };
            if (tg > 255) { frame.data[i * 4 + 1] = 255 } else { frame.data[i * 4 + 1] = tg };
            if (tb > 255) { frame.data[i * 4 + 2] = 255 } else { frame.data[i * 4 + 2] = tb };
        }
    }
}