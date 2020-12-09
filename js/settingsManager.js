export default class SettingsManager {

    constructor(){
    let startInput = document.querySelector("#startInput");
    //startInput.addEventListener("change", setNewStartTime());

    let endInput = document.querySelector("#endInput");
    //endInput.addEventListener("change", setNewEndTime());
    }

     static onSettingsClick(event, durationMap) {
        let settingsContainer = document.querySelector(".settingsContainer");
        let settingsStartTime = document.querySelector("#startInput");
        let settingsEndTime = document.querySelector("#endInput");
        if (settingsContainer.style.display == 'none') {
             settingsContainer.style.display = 'initial';
             settingsStartTime.value = "00:00";
             //settingsEndTime.value = "00:30";
             let endDuration = durationMap.get(event.currentTarget.parentNode.parentNode.getAttribute("id"));
             endDuration = String(parseFloat(endDuration).toFixed(2)).replace('.', ':');
             settingsEndTime.value = endDuration;
             //how to get value to accept endDuration;
         }else{
             settingsContainer.style.display = 'none';
             settingsContainer.removeAttribute("settingsKey");
         }
     }

     static closeSettings(event){
     let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingskey");
     onSettingsClick(event);
     //
     }

}

