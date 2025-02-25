// This function checks if the user inputs the id, and starts the timer
document.querySelector('#startRace').addEventListener('click', () => {
    startTime = Date.now();
    document.querySelector("#startRace").disabled = true;
    document.querySelector("#endRace").disabled = false;
    document.querySelector("#submitResults").disabled = false;
    timer();
});

// End stop timer
document.querySelector('#endRace').addEventListener('click', () => {
    document.querySelector("#startRace").disabled = false;
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#submitResults").disabled = true;
    document.querySelector("#clearResults").disabled = false;

    clearInterval(timerInterval);
});

// Submit the results
document.querySelector('#submitResults').addEventListener('click', () => {
    sendElapsedTime();
});

// Clear the results
document.querySelector('#clearResults').addEventListener('click', () => {
    document.querySelector("#startRace").disabled = false;
    document.querySelector("#endRace").disabled = true;
    document.querySelector("#finishTimes").innerHTML = "";
    document.querySelector("#submitResults").disabled = true;
    document.querySelector("#clearResults").disabled = true;

    clearResults();
});

document.querySelector('#test').addEventListener('click', async () => { 
    let highest = await getRacer(); 

    let finishTimes = document.querySelector("#finishTimes");
    finishTimes.innerHTML = ""; // Clear previous results

    highest.forEach(race => {
        let p = document.createElement("p"); // Create a new paragraph for each result
        p.textContent = `${race.racer}: ${race.time}`;
        finishTimes.appendChild(p); // Append to the results container
    });
});
// racer name
let racerName = 0;

// Timer Variables
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;

// This function starts the timer
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

// This function stops the timer and returns the elapsed time
function getElapsedTime() {
    clearInterval(timerInterval);
    return elapsedTime;
}

// This function sends the elapsed time to the server
function sendElapsedTime() {
    racerName += 1;
    
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

// This function retrieves the all the results from the server
async function getRacer() {
    try {
        const response = await fetch('http://localhost:8080/api/getRaceResults');
        if (!response.ok) throw new Error('Failed to fetch race results');
        return await response.json(); 
    } catch (error) {
        console.error("Error retrieving results:", error);
        return []; 
    }
}

// This function clears the results
async function clearResults() {
    // Call API to clear JSON file
    fetch('http://localhost:8080/api/clearRaceResults', { 
        method: 'POST' 
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error("Error clearing results:", error));
};
