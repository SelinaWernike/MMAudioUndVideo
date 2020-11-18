export default class DownloadManager {
    constructor(videoController) {
        window.onSaveClick = function(){
            let track = videoController.assembleTrack(videoController.videoManager);
            console.log(track);
            let fileKeys = videoController.videoManager.getFileKeys();
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