// Timer Variables
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;
let racerName = 0;
let count = 0;
let isPaused = false;
let pausedTime = 0;

// Starts or resumes the timer
function startTimer() {
    if (isPaused) {
        // Resume from the paused time
        startTime = Date.now() - pausedTime;
    } else {
        // Start fresh
        startTime = Date.now();
    }

    isPaused = false;

    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeDiff = currentTime - startTime;
        pausedTime = timeDiff; // Store elapsed time for resuming

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

// Pauses the timer
function pauseTimer() {
    if (!isPaused) {
        clearInterval(timerInterval);
        isPaused = true;
    }
}

// Stops the timer completely
function stopTimer() {
    clearInterval(timerInterval);
    isPaused = false;
    pausedTime = 0; // Reset the paused time
}

// This function sends the race result to the server
function sendElapsedTime() {
    return new Promise((resolve, reject) => {
        racerName += 1;

        fetch('http://localhost:8080/api/saveRaceResult', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time: elapsedTime, racer: racerName })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Race result saved:", data);
            resolve();  // Resolve the promise after data is successfully saved
        })
        .catch(error => {
            console.error("Error saving result:", error);
            reject(error);  // Reject the promise if there's an error
        });
    });
}

function updateRacer(id, racer_name) {
    fetch('/api/updateRacer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, racer_name })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error("Error updating racer:", error));
}

// This function retrieves all race results from the server
function getRaceResults() {
    fetch('http://localhost:8080/api/getRaceResults')
        .then(response => response.json())
        .then(results => {
            const finishTimes = document.querySelector("#finishTimes");
            finishTimes.innerHTML = ""; // Clear previous results

            // Sort results by 'id' to ensure they appear in the correct order
            results.sort((a, b) => a.id - b.id); // Sort by id if that's the correct ordering

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

// This function clears database data
function clearData() {
    stopTimer();
    fetch('http://localhost:8080/api/clearRaceResults', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        
        // This resests the finishTimes list
        document.querySelector("#finishTimes").innerHTML = "";
    })
    .catch(error => {
        console.error("Error clearing results:", error);
    });
}

// Start/Stop Timer Button Logic
document.querySelector('#startRace').addEventListener('click', () => {
    startTimer();
    document.querySelector("#startRace").disabled = true;
    document.querySelector("#endRace").disabled = false;
    document.querySelector("#submitResults").disabled = false;

});

document.querySelector('#endRace').addEventListener('click', () => {
    pauseTimer();
    document.querySelector("#startRace").disabled = false;
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#submitResults").disabled = true;
    document.querySelector("#clearResults").disabled = false;
    document.querySelector("#startRace").textContent = "Resume";
});

// Clear Results Button Logic
document.querySelector('#clearResults').addEventListener('click', () => {
    let x;
    if (confirm("Are you sure?") == true) {
        x = "You pressed OK!";
        racerName = 0;
        document.querySelector("#clearResults").disabled = true;

        clearData();
        document.querySelector("#startRace").textContent = "Start Race";
    } else {
        x = "You pressed Cancel!";
    }
});

// Submit Results Button Logic
document.querySelector('#submitResults').addEventListener('click', () => {
    sendElapsedTime()
        .then(() => getRaceResults())  // Call getRaceResults after sendElapsedTime is done
        .catch(error => console.error("Error:", error));  // Handle any error that might occur
});

document.querySelector("#submitRacer").addEventListener('click', () => {
    const racerInput = document.querySelector("#participant");

    if (!racerInput) {
        console.error("Error: #participant input not found!");
        return;
    }

    count += 1;
    const id = count;
    const racer_name = racerInput.value.trim(); // Trim to remove extra spaces

    // Prevents sending empty names
    if (racer_name === "") {
        console.warn("Error: Input is empty!");
        return;
    }

    // Call updateRacer to update the racer name 
    updateRacer(id, racer_name);
    // Call getRaceResults after updateRacer is done
    getRaceResults();
    racerInput.value = "";
});