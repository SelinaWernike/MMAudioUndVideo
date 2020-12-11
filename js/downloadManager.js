import RenderToFile from "./downloadWorker.js"

export default class DownloadManager {
    constructor(fileManager, filterManager, videoManager, effectManager) {
        window.onSaveClick = function () {
            if (videoManager.fileKeys.length > 0) {
                new RenderToFile(720, 480, fileManager, filterManager, videoManager, effectManager).then(saveClick)
            }
        };
    }
}

function saveClick(fileURL) {
    // anchor element to automatically trigger file download from
    const anchor = document.createElement('a');
    anchor.href = fileURL;
    anchor.target = "_blank";
    anchor.download = "Test.mp4";
    anchor.click();
}