export default class SettingsManager {

    constructor(trackController){
    let startInput = document.querySelector("#startInput");
    //startInput.addEventListener("change", setNewStartTime());

    let endInput = document.querySelector("#endInput");
    //endInput.addEventListener("change", setNewEndTime());


    window.onSettingsOK = function(){
            let startValue = document.querySelector("#startInput").value;
            let endValue = document.querySelector("#endInput").value;
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");

            let durationMap;

            switch(settingsTrack){
                case "videotrack":
                    durationMap = trackController.maintrack.durationMap;
                    console.log("videotrack");
                    break;
                case "audiotrack":
                    durationMap = trackController.audiotrack.durationMap;
                    console.log("audiotrack");
                    break;
                default:
                    console.log("forbidden track name " + settingsTrack);
                    break;
            }

            if(typeof durationMap != 'undefined'){
                console.log(durationMap.get(settingsKey));
                let duration = durationMap.get(settingsKey)[0];
                durationMap.delete(settingsKey);
                durationMap.set(settingsKey, [duration, Number(startValue), Number(endValue)]);
                console.log(durationMap.get(settingsKey));
            }

            SettingsManager.closeSettings();
            }
    }

    static onSettingsClick(event, durationMap) {
            let settingsContainer = document.querySelector(".settingsContainer");
            if (settingsContainer.style.display == 'none') {
                 this.openSettings(event, durationMap);
             }else{
                 this.closeSettings();
             }
         }

         static openSettings(event, durationMap){
         let settingsContainer = document.querySelector(".settingsContainer");
            let settingsStartTime = document.querySelector("#startInput");
            let settingsEndTime = document.querySelector("#endInput");
            let settingsTrack = event.currentTarget.parentNode.parentNode.parentNode.getAttribute("id");
            let settingsKey = event.currentTarget.parentNode.parentNode.getAttribute("id");
            settingsContainer.style.display = 'initial';
            settingsStartTime.value = durationMap.get(settingsKey)[1];
            settingsEndTime.value = durationMap.get(settingsKey)[2];
            settingsContainer.setAttribute("settingsKey", settingsKey);
            settingsContainer.setAttribute("settingsTrack", settingsTrack);
            console.log(event.currentTarget.parentNode);}

         static closeSettings(){
            let settingsContainer = document.querySelector(".settingsContainer");
            settingsContainer.style.display = 'none';
            settingsContainer.removeAttribute("settingsKey");
            settingsContainer.removeAttribute("settingsTrack");
         }
}
