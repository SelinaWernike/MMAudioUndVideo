/**
 * feature abandoned for now
 */
export default class DownloadManager {
    constructor(videoController) {
        window.onSaveClick = function(){
            let fileKeys = videoController.videoManager.fileKeys;
            if (fileKeys.length > 0){
                saveClick(videoController.fileManager.fileMap.get(fileKeys[0]));
            }
        };
    }
}

function saveClick(fileURL) {
    // anchor element to automatically trigger file download from
    const anchor = document.createElement('a');
    anchor.href = fileURL; //blobUrl;
    anchor.target = "_blank";
    anchor.download = "Test.mp4";
    anchor.click();
}