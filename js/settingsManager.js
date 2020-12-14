export default class SettingsManager {

    constructor(trackController){
        this.display = false;
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
                    trackController.maintrack.changeTime(settingsKey, {duration: Number(endValue) - Number(startValue), startTime:Number(startValue)});
                    console.log("videotrack");
                    break;
                case "audiotrack":
                    trackController.audiotrack.changeTime(settingsKey, {duration: Number(endValue) - Number(startValue), startTime:Number(startValue)});
                    console.log("audiotrack");
                    break;
                default:
                    console.log("forbidden track name " + settingsTrack);
                    break;
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
             let grid =  document.querySelector("#lowerArea");
             grid.style.gridTemplateAreas = ("\'header auto\'\'track1 settings\'\' track2 settings\'\'track3 settings\'");
             grid.style.gridTemplateColumns = "70% 30%"
         let settingsContainer = document.querySelector(".settingsContainer");
            let settingsStartTime = document.querySelector("#startInput");
            let settingsEndTime = document.querySelector("#endInput");
            let settingsTrack = event.currentTarget.parentNode.parentNode.parentNode.getAttribute("id");
            let settingsKey = event.currentTarget.parentNode.parentNode.getAttribute("id");
            settingsContainer.style.display = 'block';
            let timeObject = durationMap.get(settingsKey);
            settingsStartTime.value = timeObject.startTime;
            settingsEndTime.value = timeObject.startTime + timeObject.duration;
            settingsContainer.setAttribute("settingsKey", settingsKey);
            settingsContainer.setAttribute("settingsTrack", settingsTrack);
            console.log(event.currentTarget.parentNode);}

         static closeSettings(){
            let grid =  document.querySelector("#lowerArea");
            let settingsContainer = document.querySelector(".settingsContainer");
            settingsContainer.style.display = 'none';
            grid.style.gridTemplateAreas = "\' header header\'\' track1 track1\'\' track2 track2\'\' track3 track3\'";
            grid.style.gridTemplateColumns = "70% 30%";
            settingsContainer.removeAttribute("settingsKey");
            settingsContainer.removeAttribute("settingsTrack");
         }
}
