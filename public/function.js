document.querySelector('#startRace').addEventListener('click', () => {
    let racerName = document.querySelector("#racerName").value.trim();
    if (!racerName) {
        alert("Please enter a racer name!");
        return;
    }

    startTime = Date.now();
    document.querySelector("#startRace").disabled = true;
    document.querySelector("#endRace").disabled = false;
    document.querySelector("#finishTimes").innerHTML = "";
    document.querySelector("#submitResults").disabled = true;
    timer();
});

document.querySelector('#endRace').addEventListener('click', () => {
    document.querySelector("#startRace").disabled = false;
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#recordFinish").disabled = false;
    document.querySelector("#submitResults").disabled = false;
    document.querySelector("#clearResults").disabled = false;

    clearInterval(timerInterval);
});

document.querySelector('#recordFinish').addEventListener('click', () => {
    let finalTime = getElapsedTime();
    let racerName = document.querySelector("#racerName").value.trim();

    document.querySelector("#finishTimes").innerHTML = `${racerName}'s Final Time: ${finalTime}`;
});

document.querySelector('#submitResults').addEventListener('click', () => {
    sendElapsedTime();
});

document.querySelector('#clearResults').addEventListener('click', () => {
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#finishTimes").innerHTML = "";
    document.querySelector("#recordFinish").disabled = true;
    document.querySelector("#submitResults").disabled = true;
    document.querySelector("#clearResults").disabled = true;
});

// Timer Variables
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;

function timer() {
    let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;

    timerInterval = setInterval(() => {
        milliseconds += 10;
        
        if (milliseconds >= 1000) {
            milliseconds = 0;
            seconds++;
        }

        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }

        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }   

        let displayMilliseconds = milliseconds % 100 === 0 ? (milliseconds / 100) : milliseconds / 10;

        elapsedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${displayMilliseconds}`;

        document.querySelector("#timer").innerHTML = elapsedTime;
    }, 10); 
}

function getElapsedTime() {
    clearInterval(timerInterval);
    return elapsedTime;
}

function sendElapsedTime() {
    let racerName = document.querySelector("#racerName").value.trim();
    
    if (!elapsedTime) {
        console.error("No recorded time to submit.");
        return;
    }

    fetch('http://localhost:8080/api/saveRaceResult', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time: elapsedTime, racer: racerName })
    })
    .then(response => response.json())
    .then(data => console.log("Race result saved:", data))
    .catch(error => console.error("Error saving result:", error));
}
