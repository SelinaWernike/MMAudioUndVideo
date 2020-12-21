export default class FileManager {

    constructor(){
        this.fileMap = new Map(); //key: getfileKey(), value: Data URLs for the file data
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    /**
     * adds files of html <input> element both to frontend list and to backend map
     */
     addFiles(fileList) {
        if (fileList.length !== 0){
            for(const file of fileList){
                this.addToFileMap(file);
                const listItem = document.createElement('li');
                listItem.className = "fileListItem"
                listItem.setAttribute('fileKey', this.getFileKey(file));
                listItem.setAttribute("draggable", true);
                listItem.addEventListener("dragstart", (e) => {
                    e.dataTransfer.setData("html", e.target.outerHTML)
                })
                const imageAndTextWrapper = document.createElement("div");
                imageAndTextWrapper.className = "fileImageContainer"
                const image = document.createElement('img');
                image.src = this.getImageForFileType(file);
                image.width = 50;
                image.className = 'fileListImage';
                image.setAttribute("draggable", false);
                imageAndTextWrapper.appendChild(image);
                const textDiv = document.createElement("div");
                textDiv.textContent = file.name;
                imageAndTextWrapper.appendChild(textDiv)
                const close = document.createElement("span");
                close.textContent = "X"
                close.className = "pointer close"
                close.onclick = () => {
                    document.getElementById("fileList").removeChild(listItem);
                    this.fileMap.delete(this.getFileKey(file));
                };
                listItem.appendChild(imageAndTextWrapper);
                listItem.appendChild(close);

                document.getElementById("fileList").appendChild(listItem);
            }
        }
     }

    /**
     *
     * @param file - element of html input element files list
     * @returns {string} - value for key of fileMap
     */
     getFileKey(file){
        return file.name.concat(file.size, file.type, file.lastModified);
     }

    /**
     * adds specified file to file map, if not already added.
     * @param file
     */
    addToFileMap(file) {
        const fileKey = this.getFileKey(file);
        if(!this.fileMap.has(fileKey)){
            const reader = new FileReader();
            reader.onerror = (event) => {
                console.error("File could not be read! Code " + event.target.error.code);
            };
            reader.onloadend = (event) => {
                this.fileMap.set(fileKey, event.target.result);
            }
            reader.readAsDataURL(file);
        }
        console.log(this.fileMap);
    }

    /**
     *
     * @param file - element of html input element files list
     * @returns {string} - the right image icon according to file type
     */
    getImageForFileType(file){
        if(file.type.includes('audio/')){
            return '/../images/audio.png';
        }else if(file.type.includes('video/')){
            return '/../images/video.png';
        }
    }
}