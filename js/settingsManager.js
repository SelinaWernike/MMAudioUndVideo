const START_INPUT = document.querySelector("#startInput");
const END_INPUT = document.querySelector("#endInput");

export default class SettingsManager {

    constructor(trackController){
        this.display = false;

        window.onSettingsOK = function(){
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
            let button = document.querySelector("#settingsConfirm");

            if(START_INPUT.checkValidity() && END_INPUT.checkValidity()){
                console.log(START_INPUT.checkValidity());
                console.log(END_INPUT.checkValidity());
                let track = SettingsManager.getTrackByString(settingsTrack, trackController);
                track.changeTime(settingsKey, {duration: Number(END_INPUT.value) - Number(START_INPUT.value), startTime:Number(START_INPUT.value)});
                SettingsManager.closeSettings();
                button.setCustomValidity("");
            }else{
                button.setCustomValidity("Bitte gib erlaubte Start- und Endzeiten ein!");
            }
        }

        window.validateStartInput = function(){
            if(Number(START_INPUT.value) > Number(END_INPUT.value)) {
                START_INPUT.setCustomValidity("Startzeit darf nicht größer als Endzeit sein!");
                START_INPUT.reportValidity();
            }else{
                START_INPUT.setCustomValidity('');
                START_INPUT.reportValidity();
            }
        }

        window.validateEndInput = function(){
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
            let track = SettingsManager.getTrackByString(settingsTrack, trackController);
            let durationMapEntry = track.durationMap.get(settingsKey);

            if(Number(START_INPUT.value) > Number(END_INPUT.value)) {
                 endInput.setCustomValidity("Endzeit darf nicht kleiner als Startzeit sein!");
            //TODO syntax nach merge prüfen!
            //}else if(Number(otherEndValue) > (durationMapEntry.start + durationMap.duration)){
                 //endInput.setCustomValidity("Endzeit darf nicht größer als Länge des Videos sein!");
            }else{
                 endInput.setCustomValidity("");
            }
            endInput.reportValidity();
        }

    }

    static getTrackByString(trackName, trackController){
        switch(trackName){
            case "videotrack":
               return trackController.maintrack;
               break;
            case "audiotrack":
               return trackController.audiotrack;
               break;
            default:
               //TODO is not returning anything a good idea in this case
               console.log("forbidden track name " + settingsTrack);
               break;
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
        //let settingsStartTime = document.querySelector("#startInput");
        //let settingsEndTime = document.querySelector("#endInput");
        let settingsTrack = event.currentTarget.parentNode.parentNode.parentNode.getAttribute("id");
        let settingsKey = event.currentTarget.parentNode.parentNode.getAttribute("id");
        settingsContainer.style.display = 'block';
        let timeObject = durationMap.get(settingsKey);
        START_INPUT.value = timeObject.startTime;
        END_INPUT.value = timeObject.startTime + timeObject.duration;
        settingsContainer.setAttribute("settingsKey", settingsKey);
        settingsContainer.setAttribute("settingsTrack", settingsTrack);
    }

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

