export default class SettingsManager {

    constructor(){
    let startInput = document.querySelector("#startInput");
    //startInput.addEventListener("change", setNewStartTime());

    let endInput = document.querySelector("#endInput");
    //endInput.addEventListener("change", setNewEndTime());
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

window.onSettingsOK = function(){
        let startValue = document.querySelector("#startInput").value;
        let endValue = document.querySelector("#endInput").value;
        let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
        let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");

        console.log(settingsKey,settingsTrack,startValue,endValue);
        //let duration = durationMap.get(settingsKey)[0];
        //durationMap.remove(settingsKey);
        //durationMap.set(settingsKey, [duration, startValue, endValue]);

        SettingsManager.closeSettings();
        }
