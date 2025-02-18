fetch('/api/test')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Fetch error:", error));

document.querySelector('#startRace').addEventListener('click', () => {
    startTime = Date.now();
    document.querySelector("#startRace").disabled = true;
    document.querySelector("#endRace").disabled = false;
    document.querySelector("#finishTimes").innerHTML = "";
    document.querySelector("#submitResults").disabled = true;
    timer();
});

document.querySelector('#clearResults').addEventListener('click', () => {
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#finishTimes").innerHTML = "";
    document.querySelector("#recordFinish").disabled = true;
    document.querySelector("#submitResults").disabled = true;
    document.querySelector("#clearResults").disabled = true;
});

document.querySelector('#endRace').addEventListener('click', () => {
    document.querySelector("#startRace").disabled = false;
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#finishTimes").innerHTML = "";
    document.querySelector("#recordFinish").disabled = false;
    document.querySelector("#submitResults").disabled = false;
    document.querySelector("#clearResults").disabled = false;
    getElapsedTime();
})

let startTime = 0;
let pauseTime = null;

function timer() {
    let milliseconds = 0, seconds = 0, minutes = 0, hours = 0;

    startTime = setInterval(() => {
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

        pauseTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${displayMilliseconds}`;

        document.querySelector("#timer").innerHTML = pauseTime;
    }, 10); 
}

function getElapsedTime() {
    clearInterval(startTime);
    console.log(pauseTime);
}