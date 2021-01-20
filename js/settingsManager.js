const START_INPUT = document.querySelector("#startInput");
const END_INPUT = document.querySelector("#endInput");
var settingsOpen;

/**
This class is responsible for the settings widget that lets you change the start/end time of a video or audio element.
*/
export default class SettingsManager {

    constructor(trackController){
        //this.display = false;
        settingsOpen = false;

        //called when pressing "OK" button - saves input field values (if valid) & closes settings widget
        window.onSettingsOK = function(){
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
            let button = document.querySelector("#settingsConfirm");

            if(START_INPUT.checkValidity() && END_INPUT.checkValidity()){
                let track = SettingsManager.getTrackByString(settingsTrack, trackController);
                let origDuration = track.durationMap.get(settingsKey).origDuration;
                track.changeTime(settingsKey, {duration: Number(END_INPUT.value) - Number(START_INPUT.value), startTime:Number(START_INPUT.value), origDuration: origDuration});
                SettingsManager.closeSettings();
                button.setCustomValidity("");
            }else{
                button.setCustomValidity("Bitte gib erlaubte Start- und Endzeiten ein!");
            }
        }

        //called when pressing "Abbrechen" Button - closes settings widget without saving input field values.
        window.onSettingsCancel = function(){
        SettingsManager.closeSettings();
        }

        //called when pressing "Zurücksetzen" Button - resets input field values to initial audio/video length
        window.onSettingsReset = function(){
        let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
        let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
        let durationMapEntry = SettingsManager.getTrackByString(settingsTrack, trackController).durationMap.get(settingsKey);

        START_INPUT.value = 0;
        END_INPUT.value = durationMapEntry.origDuration;

        SettingsManager.resetAllValidity();
        }

        //validates value of start time input field
        window.processStartInput = function(){
            if(Number(START_INPUT.value) > Number(END_INPUT.value)) {
                START_INPUT.setCustomValidity("Startzeit darf nicht größer als Endzeit sein!");
            }else if(Number(START_INPUT.value) == Number(END_INPUT.value)){
                START_INPUT.setCustomValidity("Startzeit darf nicht gleich groß wie Endzeit sein!");
            }else{
                let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
                let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
                START_INPUT.setCustomValidity('');
                SettingsManager.resetOKButtonValidity();
                const track = SettingsManager.getTrackByString(settingsTrack, trackController);
                trackController.jumpToTime(START_INPUT.value, track, settingsKey);
            }
             START_INPUT.reportValidity();
        }

        //validates value of end time input field
        window.processEndInput = function(){
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrack = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
            let track = SettingsManager.getTrackByString(settingsTrack, trackController);
            let durationMapEntry = track.durationMap.get(settingsKey);

            if(Number(START_INPUT.value) > Number(END_INPUT.value)) {
                 END_INPUT.setCustomValidity("Endzeit darf nicht kleiner als Startzeit sein!");
            }else if(Number(END_INPUT.value) > durationMapEntry.origDuration){
                 END_INPUT.setCustomValidity("Endzeit darf nicht größer als Länge des Audios/Videos sein!");
            }else if(Number(START_INPUT.value) == Number(END_INPUT.value)){
                 END_INPUT.setCustomValidity("Endzeit darf nicht gleich groß wie Startzeit sein!");
            }else{
                 END_INPUT.setCustomValidity("");
                 SettingsManager.resetOKButtonValidity();
                 trackController.jumpToTime(END_INPUT.value, track, settingsKey);
            }
            endInput.reportValidity();
        }
    }

/**
Returns appropriate track object of trackController for input string.
@param String trackName
@param {Object} trackController - knows track objects
@returns {Object} track - track object associated with input String
*/
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

/**
Responds to click on settings button according to current state of settings widget.
@param {Object} event - event created by click on settings icon
@param {Object} durationMap - contains information to be displayed in settings widget
*/
    static onSettingsClick(event, durationMap) {
         if (!settingsOpen) {
            this.openSettings(event, durationMap);
         }else{
            let settingsKey = document.querySelector(".settingsContainer").getAttribute("settingsKey");
            let settingsTrackName = document.querySelector(".settingsContainer").getAttribute("settingsTrack");
            this.closeSettings();
            if(settingsKey != event.currentTarget.parentNode.parentNode.getAttribute("id")
             || settingsTrackName != event.currentTarget.parentNode.parentNode.parentNode.getAttribute("id")){
                this.openSettings(event, durationMap);
            }
         }
    }

/**
Rearranges CSS to display settings widget and fills fields with values
according to element the settings button was clicked on.
@param {Object} event - triggered by settings button click
@param {Object} durationMap - contains values necessary to displaying start and end time
*/
    static openSettings(event, durationMap){
        let settingsContainer = document.querySelector(".settingsContainer");
        if(settingsContainer.style.display == 'none'){
            let grid =  document.querySelector("#lowerArea");
             grid.style.gridTemplateAreas = ("\'header auto\'\'track1 settings\'\'track3 settings\'\' track2 settings\'");
              grid.style.gridTemplateColumns = "80% 20%"
            settingsContainer.style.display = 'block';
        }
        let settingsTrack = event.currentTarget.parentNode.parentNode.parentNode.getAttribute("id");
        let settingsKey = event.currentTarget.parentNode.parentNode.getAttribute("id");
        let timeObject = durationMap.get(settingsKey);
        START_INPUT.value = timeObject.startTime;
        END_INPUT.value = timeObject.startTime + timeObject.duration;
        settingsContainer.setAttribute("settingsKey", settingsKey);
        settingsContainer.setAttribute("settingsTrack", settingsTrack);

        settingsOpen = true;
        event.currentTarget.parentNode.parentNode.classList.add('highlight');
    }

/**
Rearranges CSS to hide settings widget.
*/
    static closeSettings(){
        let grid =  document.querySelector("#lowerArea");
        let settingsContainer = document.querySelector(".settingsContainer");
        settingsContainer.style.display = 'none';
        grid.style.gridTemplateAreas = "\' header header\'\' track1 track1\'\' track3 track3\'\' track2 track2\'";
        grid.style.gridTemplateColumns = "80% 20%";
        settingsContainer.removeAttribute("settingsKey");
        settingsContainer.removeAttribute("settingsTrack");

        settingsOpen = false;
        let highlightedElement = document.querySelector(".highlight");
        highlightedElement.classList.remove("highlight");
        this.resetAllValidity();
    }

    /**
    Are settings currently open or not?
    returns boolean settingsOpen
    */
    static isSettingsOpen(){
        return settingsOpen;
    }

    /**
    Resets OK button to not be highlighted red
    */
    static resetOKButtonValidity(){
    let okButton = document.querySelector("#settingsConfirm");
    okButton.setCustomValidity("");
    okButton.reportValidity();
    }

    /**
    Resets all inputs (OK button, start and end time input)
    */
    static resetAllValidity(){
        START_INPUT.setCustomValidity('');
        END_INPUT.setCustomValidity('');
        START_INPUT.reportValidity();
        END_INPUT.reportValidity();
        SettingsManager.resetOKButtonValidity();
    }

}