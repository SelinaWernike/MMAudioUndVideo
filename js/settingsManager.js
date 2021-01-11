const START_INPUT = document.querySelector("#startInput");
const END_INPUT = document.querySelector("#endInput");
let closeBtn;

export default class SettingsManager {

    constructor(trackController){
        this.display = false;

        window.onSettingsOK = function(){
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
            let button = document.querySelector("#settingsConfirm");

            if(START_INPUT.checkValidity() && END_INPUT.checkValidity()){
                let track = SettingsManager.getTrackByString(settingsTrack, trackController);
                track.changeTime(settingsKey, {duration: Number(END_INPUT.value) - Number(START_INPUT.value), startTime:Number(START_INPUT.value)});
                SettingsManager.closeSettings();
                button.setCustomValidity("");
            }else{
                button.setCustomValidity("Bitte gib erlaubte Start- und Endzeiten ein!");
            }
        }

        window.onSettingsCancel = function(){
        SettingsManager.closeSettings();
        }

        window.processStartInput = function(){
            if(Number(START_INPUT.value) > Number(END_INPUT.value)) {
                START_INPUT.setCustomValidity("Startzeit darf nicht größer als Endzeit sein!");
                START_INPUT.reportValidity();
            }else{
                let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
                let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
                START_INPUT.setCustomValidity('');
                START_INPUT.reportValidity();
                const track = SettingsManager.getTrackByString(settingsTrack, trackController);
                trackController.jumpToTime(START_INPUT.value, track, settingsKey);
            }
        }

        window.processEndInput = function(){
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
            let track = SettingsManager.getTrackByString(settingsTrack, trackController);
            let durationMapEntry = track.durationMap.get(settingsKey);

            if(Number(START_INPUT.value) > Number(END_INPUT.value)) {
                 endInput.setCustomValidity("Endzeit darf nicht kleiner als Startzeit sein!");
            }else if(Number(END_INPUT.value) > (durationMapEntry.startTime + durationMapEntry.duration)){
                 //problem: ich kenne Original-Endzeit/duration nicht
                 //wie komme ich am effizientesten an Daten aus fileMap?
                 //(da müsste die echte duration drinstehen)
                 endInput.setCustomValidity("Endzeit darf nicht größer als Länge des Videos sein!");
            }else{
                 endInput.setCustomValidity("");
                 START_INPUT.reportValidity();
                 const track = SettingsManager.getTrackByString(settingsTrack, trackController);
                 trackController.jumpToTime(END_INPUT.value, track, settingsKey);
            }
            endInput.reportValidity();

        }
        //todo zu Zeitpunkt springen (sobald das bei processStartInput funktioniert)
    }

    static getTrackByString(trackName, trackController){
        switch(trackName){
            case "videotrack":
               return trackController.maintrack;
            case "audiotrack":
               return trackController.audiotrack;
            default:
               console.log("forbidden track name " + trackName);
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
        let settingsTrack = event.currentTarget.parentNode.parentNode.parentNode.getAttribute("id");
        let settingsKey = event.currentTarget.parentNode.parentNode.getAttribute("id");
        settingsContainer.style.display = 'block';
        let timeObject = durationMap.get(settingsKey);
        START_INPUT.value = timeObject.startTime;
        END_INPUT.value = timeObject.startTime + timeObject.duration;
        settingsContainer.setAttribute("settingsKey", settingsKey);
        settingsContainer.setAttribute("settingsTrack", settingsTrack);
        closeBtn = document.querySelector("#" + settingsKey).childNodes[0].childNodes[2];
        closeBtn.style.display = "none";
        
        
    }

    static closeSettings(){
        let grid =  document.querySelector("#lowerArea");
        let settingsContainer = document.querySelector(".settingsContainer");
        settingsContainer.style.display = 'none';
        grid.style.gridTemplateAreas = "\' header header\'\' track1 track1\'\' track2 track2\'\' track3 track3\'";
        grid.style.gridTemplateColumns = "70% 30%";
        settingsContainer.removeAttribute("settingsKey");
        settingsContainer.removeAttribute("settingsTrack");
        if(closeBtn) {
            closeBtn.style.display = "inline";
        }
    }
}

