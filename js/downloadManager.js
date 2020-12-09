/**
 * feature abandoned for now
 */
export default class DownloadManager {
    constructor(videoManager, fileManager) {
        window.onSaveClick = function(){
            if (videoManager.fileKeys.length > 0){
                saveClick(fileManager.fileMap.get(fileKeys[0]));
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