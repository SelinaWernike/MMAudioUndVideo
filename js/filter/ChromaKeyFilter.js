export default class ChromaKeyFilter {

    apply(frame) {
        let l = frame.data.length / 4;
        let x = 1;

        /*switch (color) {
            case 'r':
                x = 0;
                break;
            case 'g':
                x = 1;
                break;
            case 'b':
                x = 1;
                break;
        }*/

        for (let i = 0; i < l; i++) {
            let c = frame.data[i * 4 + x];

            // change all greens to white
            if (c > 100) frame.data[i * 4 + x] = 0;
        }
    }
}