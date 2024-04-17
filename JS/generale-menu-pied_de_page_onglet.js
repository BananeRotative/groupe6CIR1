// ------- CLOCK -------

let digitIDs = [
    "clock-current-hours-tens",
    "clock-current-hours-units",
    "clock-current-minutes-tens",
    "clock-current-minutes-units",
    "clock-time-on-page-minutes-tens",
    "clock-time-on-page-minutes-units",
    "clock-time-on-page-seconds-tens",
    "clock-time-on-page-seconds-units"
];

// Date on page loading
let initialDate;

function addSegments(digitId){
    // Get digit html element
    let digit = document.getElementById(digitId);

    // Add the 7 segments
    for (let i=0; i<7; i++) {
        let segment = document.createElement("div");
        segment.className = `segment off segment${i}`;
        digit.appendChild(segment);
    }
}

function updateDigit(digitId, value){

    let segmentStates = [
        [1, 1, 1, 0, 1, 1, 1],
        [0, 0, 1, 0, 0, 1, 0],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 1],
        [0, 1, 1, 1, 0, 1, 0],
        [1, 1, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1]
    ];

    // Get digit HTML element
    let digit = document.getElementById(digitId);

    // Check if 
    if (digit.children.length < 7) {    // Check if digit has enough segments
        console.log("digit element has too few digits");
    }

    // Update each digit
    for (let i=0; i<7; i++) {
        let segment = digit.children[i];    // Get segment number i
        if (segmentStates[value][i]) {
            segment.classList.remove("segmentOff");    // Remove off state
        }
        else {
            segment.classList.add("segmentOff");       // Set off state
        }
    }
}

function updateTime() {
    let date = new Date();

    // Update hours tens
    let hours = date.getHours();
    if (hours >= 10) {
        updateDigit(digitIDs[0], (hours - hours%10)/10);
    }
    else {
        updateDigit(digitIDs[0], 0);
    }

    // Update hours units
    updateDigit(digitIDs[1], hours%10);

    // Update minutes tens
    let minutes = date.getMinutes();
    if (minutes >= 10) {
        updateDigit(digitIDs[2], (minutes - minutes%10)/10);        // Current time
    }
    else {
        updateDigit(digitIDs[2], 0);    // Current time
    }

    // Update minutes units
    updateDigit(digitIDs[3], minutes%10);
}

function updateTimeOnPage() {
    let currentDate = new Date();
    let timeOnPage = currentDate-initialDate;
    // Update minutes tens
    let minutes = Math.floor(timeOnPage/60000);
    if (minutes >= 10) {
        updateDigit(digitIDs[4], (minutes - minutes%10)/10);
    }
    else {
        updateDigit(digitIDs[4], 0);
    }
    // Update minutes units
    updateDigit(digitIDs[5], minutes%10);

    // Update seconds tens
    let seconds = Math.floor(timeOnPage/1000) - 60*minutes;
    if (seconds >= 10) {
        updateDigit(digitIDs[6], (seconds - seconds%10)/10);
    }
    else {
        updateDigit(digitIDs[6], 0);
    }
    // Update seconds units
    updateDigit(digitIDs[7], seconds%10);
}

function updateTimeInit() {
    // We need to init time update differently because we want to garantee precision
    // in time update without updating every second
    updateTime();
    setInterval(updateTime, 60000);     // every minute
}

function setColonOn() {
    let colonsHTML = document.getElementsByClassName("colon");
    Array.from(colonsHTML)
        .forEach(function (element) {
            element.classList.remove("segmentOff");  // Remove off state
        });
}

function setColonOff() {
    let colonsHTML = document.getElementsByClassName("colon");
    Array.from(colonsHTML)
        .forEach( function (element) {
            element.classList.add("segmentOff");     // Set off state
        });
}

function initRoutineColonOff() {
    setColonOff();
    setInterval(setColonOff, 2000); // Set colon off every 2 seconds
}

function initRoutineColonOn() {
    setColonOn();
    setInterval(setColonOn, 2000);  // Set colon on every 2 seconds
}

function updateSecondsInit() {
    // Call this function to init colon animation
    initRoutineColonOn();
    setTimeout(initRoutineColonOff, 1000);  // Delay colon off animation by 1 second

    // Init time on page actualisations for seconds
    initialDate = new Date();
    updateTimeOnPage();
    setInterval(updateTimeOnPage, 1000);
}


function initClock(){
    for (digitID of digitIDs) {
        // Add segments for the 4 digits
        addSegments(digitID);
    }

    // Prepare for time updates
    updateTime();
    let date = new Date();
    // Wait for the next minute update to call initialization
    setTimeout(updateTimeInit, 60000 -date.getSeconds()*1000 -date.getMilliseconds());

    // Prepare for colon updates
    setTimeout(updateSecondsInit, 1000 -date.getMilliseconds());
}

function main() {
    initClock();
}

main();