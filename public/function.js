// Timer Variables
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;
let racerName = 0;
let count = 0;
let isPaused = false;
let pausedTime = 0;
let numCheckpoint = 0;
let numFinish = 0;
let checkpointData = {};

// Save local results array in localStorage if not already
if (!localStorage.getItem('raceResults')) {
  localStorage.setItem('raceResults', JSON.stringify([]));
}

function getLocalResults() {
  return JSON.parse(localStorage.getItem('raceResults')) || [];
}

function setLocalResults(results) {
  localStorage.setItem('raceResults', JSON.stringify(results));
}

// Start or resume timer
function startTimer() {
  if (isPaused) {
    startTime = Date.now() - pausedTime;
  } else {
    startTime = Date.now();
  }

  isPaused = false;

  timerInterval = setInterval(() => {
    const currentTime = Date.now();
    const timeDiff = currentTime - startTime;
    pausedTime = timeDiff;

    const milliseconds = timeDiff % 1000;
    const seconds = Math.floor(timeDiff / 1000) % 60;
    const minutes = Math.floor(timeDiff / 60000);

    const formattedMilliseconds = (milliseconds / 10).toFixed(0).padStart(2, '0');
    elapsedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${formattedMilliseconds}`;

    document.querySelector('#timer').innerHTML = elapsedTime;
  }, 10);
}

function pauseTimer() {
  if (!isPaused) {
    clearInterval(timerInterval);
    isPaused = true;
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  isPaused = false;
  pausedTime = 0;
}

// Save result locally instead of sending to server
function saveResultLocally() {
  racerName += 1;
  const results = getLocalResults();
  results.push({ id: racerName, racer_name: `Racer ${racerName}`, time: elapsedTime, checkpoint: numFinish });
  setLocalResults(results);
  renderRaceResults();
}

// Submit local results to server
async function submitToServer() {
  const results = getLocalResults(); // Get all local results

  if (!results || results.length === 0) {
    alert('No results to submit!');
    return;
  }

  try {
    for (const result of results) {
      const response = await fetch('http://localhost:8080/api/saveRaceResult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          racer: result.racer_name,
          time: result.time,
          checkpoint: result.checkpoint,
        }),
      });

      if (!response.ok) {
        console.error('Failed to submit result:', await response.text());
      }
    }

    alert('All results submitted to the server!');
    localStorage.removeItem('raceResults'); // Clear after successful submission
    renderRaceResults(); // Refresh UI
  } catch (err) {
    console.error('Error submitting to server:', err);
    alert('Error submitting results to server.');
  }
}

async function updateRacer(id, racer_name) {
  const results = getLocalResults();
  const updated = results.map((res) => (res.id === id ? { ...res, racer_name } : res));
  setLocalResults(updated);
  renderRaceResults();
}

function renderRaceResults() {
  const results = getLocalResults();
  const finishTimes = document.querySelector('#finishTimes');
  finishTimes.innerHTML = '';

  const ul = document.createElement('ul');

  results
    .filter(result => result.checkpoint === numFinish)
    .forEach(result => {
      const li = document.createElement('li');
      li.textContent = `Racer ${result.id}: ${result.time}`;
      ul.appendChild(li);
    });

  finishTimes.appendChild(ul);
}

function addResult(time, checkpoint) {
  const results = getLocalResults();
  const checkpointResults = results.filter(r => r.checkpoint === checkpoint);
  const id = checkpointResults.length + 1;
  const racer_name = `Racer ${id}`;

  results.push({ id, racer_name, time, checkpoint });
  setLocalResults(results);
}

function clearLocalData() {
  localStorage.removeItem('raceResults');
  racerName = 0;

  Object.keys(checkpointData).forEach(key => {
    checkpointData[key] = [];
  });

  document.querySelectorAll('.times-list').forEach(list => {
    list.innerHTML = '';
  });

  renderRaceResults();
  stopTimer();
}

async function clearData() {
  try {
    const res = await fetch('http://localhost:8080/api/clearRaceResults', {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(`Failed to clear: ${res.status}`);

    console.log((await res.json()).message);
    alert('Race results cleared from the database!');
  } catch (err) {
    console.error('Error clearing results:', err);
    alert('Failed to clear race results.');
  }
}

// Event Listeners
document.querySelector('#startRace').addEventListener('click', () => {
  startTimer();
  document.querySelector('#startRace').disabled = true;
  document.querySelector('#endRace').disabled = false;
  document.querySelector('#submitResults').disabled = false;
});

document.querySelector('#endRace').addEventListener('click', () => {
  pauseTimer();
  document.querySelector('#startRace').disabled = false;
  document.querySelector('#endRace').disabled = true;
  document.querySelector('#submitResults').disabled = true;
  document.querySelector('#clearResults').disabled = false;
  document.querySelector('#startRace').textContent = 'Resume';
  document.querySelector('#exportResults').hidden = false;
});

document.querySelector('#clearResults').addEventListener('click', () => {
  if (confirm('Are you sure?')) {
    clearLocalData();
    clearData();
    document.querySelector('#clearResults').disabled = true;
    document.querySelector('#startRace').textContent = 'Start Race';
  }
});

document.querySelector('#submitResults').addEventListener('click', () => {
  saveResultLocally();
});

document.querySelector('#submitRacer').addEventListener('click', async () => {
  const racerInput = document.querySelector('#participant');
  count += 1;
  const id = count;
  const racer_name = racerInput.value.trim();

  if (racer_name !== '') {
    await updateRacer(id, racer_name);
    racerInput.value = '';
  }

  renderRaceResults();
});

document.querySelector('#exportResults').addEventListener('click', () => {
  window.location.href = 'http://localhost:8080/api/exportRaceResults';
});

document.querySelector('#sendData').addEventListener('click', async () => {
  await submitToServer();
});

document.querySelector('#generateTables').addEventListener('click', () => {
  // Get the number of checkpoints
  numCheckpoint = parseInt(document.querySelector('#checkpointLocation').value);
  numFinish = numCheckpoint + 1;
  const container = document.querySelector('#checkpointsContainer');
  const template = document.querySelector('#checkpointTemplate');

  // Clear any previous checkpoints
  container.innerHTML = '';

  // Validate the number of checkpoints
  if (isNaN(numCheckpoint) || numCheckpoint <= 0) {
    alert('Please enter a valid number of checkpoints.');
    return;
  }

  for (let i = 1; i <= numCheckpoint; i++) {
    const clone = template.content.cloneNode(true);

    // Set the checkpoint number and button data
    clone.querySelector('.checkpoint-number').textContent = i;
    clone.querySelector('.checkpoint-button').dataset.checkpoint = i;
    clone.querySelector('.times-list').id = `timesList-${i}`;

    container.appendChild(clone);

    checkpointData[i] = [];
  }
});

// Use event delegation to handle clicks on dynamically created checkpoint buttons
document.querySelector('#checkpointsContainer').addEventListener('click', function (event) {
  if (event.target.classList.contains('checkpoint-button')) {
    const checkpoint = parseInt(event.target.dataset.checkpoint);

    checkpointData[checkpoint].push(elapsedTime);

    console.log(`Checkpoint ${checkpoint} times:`, checkpointData[checkpoint]);

    const checkpointSection = event.target.closest('.checkpoint');
    const timesList = checkpointSection.querySelector('.times-list');

    const li = document.createElement('li');
    li.textContent = elapsedTime;
    timesList.appendChild(li);

    addResult(elapsedTime, checkpoint);
  }
});
