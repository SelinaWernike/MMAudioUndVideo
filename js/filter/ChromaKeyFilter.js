export default class ChromaKeyFilter {

    apply(frame) {
        let l = frame.data.length / 4;
        for (let i = 0; i < l; i++) {
            let r = frame.data[i * 4 + 0];
            let g = frame.data[i * 4 + 1];
            let b = frame.data[i * 4 + 2];
    
            if (g > 100) frame.data[i * 4 + 3] = 0;
        }
    }
}