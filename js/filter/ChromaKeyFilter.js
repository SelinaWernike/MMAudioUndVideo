export default class ChromaKeyFilter {

    apply(frame) {
        let l = frame.data.length / 4;
        for (let i = 0; i < l; i++) {
            let g = frame.data[i * 4 + 1];
    
            if (g > 100) frame.data[i * 4 + 1] = 0;
        }
    }
}