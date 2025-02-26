// Timer Variables
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;
let racerName = 0;

// This function starts the timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeDiff = currentTime - startTime;

        // Calculate minutes, seconds, and milliseconds
        let milliseconds = timeDiff % 1000;
        let seconds = Math.floor(timeDiff / 1000) % 60;
        let minutes = Math.floor(timeDiff / 60000);

        // Format time as mm:ss:ms
        let formattedMilliseconds = (milliseconds / 10).toFixed(0).padStart(2, '0');
        elapsedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${formattedMilliseconds}`;

        document.querySelector("#timer").innerHTML = elapsedTime;
    }, 10);
}

// This function stops the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// This function sends the race result to the server
function sendElapsedTime() {
    racerName += 1;

    fetch('http://localhost:8080/api/saveRaceResult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: elapsedTime, racer: racerName })
    })
    .then(response => response.json())
    .then(data => console.log("Race result saved:", data))
    .catch(error => console.error("Error saving result:", error));
}

// This function retrieves all race results from the server
function getRaceResults() {
    fetch('http://localhost:8080/api/getRaceResults')
        .then(response => response.json())
        .then(results => {
            const finishTimes = document.querySelector("#finishTimes");
            finishTimes.innerHTML = ""; // Clear previous results

            const ul = document.createElement("ul");

            results.forEach(result => {
                // Create a list item (li) for each result
                const li = document.createElement("li");
                li.textContent = `${result.racer_name}: ${result.time}`;

                ul.appendChild(li);
            });

            finishTimes.appendChild(ul);
        })
        .catch(error => console.error("Error retrieving results:", error));
}

// Start/Stop Timer Button Logic
document.querySelector('#startRace').addEventListener('click', () => {
    startTimer();
    document.querySelector("#startRace").disabled = true;
    document.querySelector("#endRace").disabled = false;
    document.querySelector("#submitResults").disabled = false;
});

document.querySelector('#endRace').addEventListener('click', () => {
    stopTimer();
    document.querySelector("#startRace").disabled = false;
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#submitResults").disabled = true;
    document.querySelector("#clearResults").disabled = false;
});

// Submit Results Button Logic
document.querySelector('#submitResults').addEventListener('click', () => {
    sendElapsedTime();
    getRaceResults();
});

document.querySelector('#clearResults').addEventListener('click', () => {

    document.querySelector("#clearResults").disabled = true;


    fetch('http://localhost:8080/api/clearRaceResults', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        
        document.querySelector("#finishTimes").innerHTML = "";
    })
    .catch(error => {
        console.error("Error clearing results:", error);
    });
});
