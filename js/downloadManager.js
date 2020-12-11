import RenderToFile from "./downloadWorker.js"

export default class DownloadManager {

    constructor(fileManager, filterManager, videoManager, effectManager) {
        this.fileManager = fileManager;
        this.filterManager = filterManager;
        this.videoManager = videoManager;
        this.effectManager = effectManager;
        this.progress = document.querySelector("#downloadProgress");
        this.saveIcon = document.querySelector("#saveIcon");
        window.onSaveClick = this.onSaveClick.bind(this);
    }

    updateProgress() {
        this.progress.value = this.renderToFile.getProgress();
    }

    onSaveClick() {
        if (this.videoManager.fileKeys.length > 0) {
            this.progress.removeAttribute("hidden");
            this.progress.value = 0;
            this.saveIcon.setAttribute("hidden", "");
            this.renderToFile = new RenderToFile(720, 480, this.fileManager, this.filterManager, this.videoManager, this.effectManager);
            this.renderToFile.then(this.onSaveDone.bind(this));
            setInterval(this.updateProgress.bind(this), 1000);
        }
    }

    onSaveDone(fileURL) {
        clearInterval(this.updateProgress);
        this.saveIcon.removeAttribute("hidden");
        this.progress.setAttribute("hidden", "");
        // anchor element to automatically trigger file download from
        const anchor = document.createElement('a');
        anchor.href = fileURL;
        anchor.target = "_blank";
        anchor.download = "Test.mp4";
        anchor.click();
    }
}
