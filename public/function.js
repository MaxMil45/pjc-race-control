// =======================
// Global Timer Variables
// =======================
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;
let racerName = 0;
let count = 0;
let isPaused = false;
let pausedTime = 0;
let numCheckpoint = 0;
let numFinish = 0;
const checkpointData = {};
const addPressCounts = {};

// =======================
// Render Race Page Template
// =======================
document.querySelector('#showRacePage').addEventListener('click', () => {
  const template = document.querySelector('#raceAppTemplate');
  const page = template.content.cloneNode(true);
  const content = document.querySelector('#pageContent');
  content.innerHTML = ''; // Clear previous content
  content.appendChild(page);

  // Initialize event listeners after rendering template
  initializeRaceEventListeners();
});

document.querySelector('#create').addEventListener('click', () => {
  const template = document.querySelector('#tmp-screen-create');
  const page = template.content.cloneNode(true);
  const content = document.querySelector('#pageContent');
  content.innerHTML = ''; // Clear previous content
  content.appendChild(page);

  // Initialize event listeners after rendering template
});

document.querySelector('#add').addEventListener('click', () => {
  const template = document.querySelector('#tmp-screen-add');
  const page = template.content.cloneNode(true);
  const content = document.querySelector('#pageContent');
  content.innerHTML = ''; // Clear previous content
  content.appendChild(page);

  // Initialize event listeners after rendering template
});

// =======================
// Local Storage Utilities
// =======================
if (!localStorage.getItem('raceResults')) {
  localStorage.setItem('raceResults', JSON.stringify([]));
}

function getLocalResults() {
  return JSON.parse(localStorage.getItem('raceResults')) || [];
}

function setLocalResults(results) {
  localStorage.setItem('raceResults', JSON.stringify(results));
}

// =======================
// Timer Functions
// =======================
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
    const minutes = Math.floor(timeDiff / 60000) % 60;
    const hours = Math.floor(timeDiff / 3600000);

    const formattedMilliseconds = (milliseconds / 10).toFixed(0).padStart(2, '0');
    elapsedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${formattedMilliseconds}`;

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

function currentTime() {
  const now = new Date();
  now.setHours(now.getHours() + 1); // add 1 hour
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

// =======================
// Race Result Functions
// =======================
function saveResultLocally() {
  const RecordedTime = currentTime();
  racerName += 1;
  const results = getLocalResults();
  results.push({ id: racerName, runnerName: `Racer ${racerName}`, time: elapsedTime, checkpoint: numFinish, date: RecordedTime });
  setLocalResults(results);
  renderRaceResults();
}

async function submitToServer() {
  const results = getLocalResults();

  if (!results || results.length === 0) {
    alert('No results to submit!');
    return;
  }

  for (const result of results) {
    const response = await fetch('http://localhost:8080/api/saveRaceResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        racer: result.runnerName,
        time: result.time,
        checkpoint: result.checkpoint,
        date: result.date,
      }),
    });

    if (!response.ok) {
      console.error('Failed to submit result:', await response.text());
      return;
    }
  }

  console.log('All results submitted to the server!');
  localStorage.removeItem('raceResults');
  renderRaceResults();
}

function updateRacer(id, runnerName, checkpoint) {
  const results = getLocalResults();

  const updated = results.map((res) =>
    res.id === id && res.checkpoint === checkpoint ? { ...res, runnerName } : res,
  );

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
      li.textContent = `${result.runnerName}: ${result.time}`;
      ul.appendChild(li);
    });

  finishTimes.appendChild(ul);
}

function renderCheckpointRacers(checkpoint) {
  const results = getLocalResults();
  const checkpointSection = document.querySelector(`.checkpoint[data-checkpoint="${checkpoint}"]`);
  const racerList = checkpointSection.querySelector('.times-list');
  racerList.innerHTML = '';

  const filteredResults = results.filter(result => result.checkpoint === checkpoint);

  filteredResults.forEach(result => {
    const li = document.createElement('li');
    li.textContent = `${result.id}: ${result.runnerName} - ${result.time}`;
    racerList.appendChild(li);
  });
}

function addResult(time, checkpoint) {
  const results = getLocalResults();
  const checkpointResults = results.filter(r => r.checkpoint === checkpoint);
  const id = checkpointResults.length + 1;
  const runnerName = `Racer ${id}`;

  results.push({ id, runnerName, time, checkpoint });
  setLocalResults(results);
}

// =======================
// Clear Data
// =======================
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
  const res = await fetch('http://localhost:8080/api/clearRaceResults', {
    method: 'DELETE',
  });

  if (!res.ok) {
    console.error(`Failed to clear: ${res.status}`);
    alert('Failed to clear race results.');
    return;
  }

  const data = await res.json();
  console.log(data.message);
}

// =======================
// Dynamic Event Listener Initialization
// =======================
function initializeRaceEventListeners() {
  const confirmDialog = document.querySelector('#confirmDialog');
  const confirmYes = document.querySelector('#confirmYes');
  const confirmNo = document.querySelector('#confirmNo');

  let onConfirm = null;

  function openConfirmDialog(callback) {
    onConfirm = callback;
    confirmDialog.showModal();
    confirmYes.focus();
  }

  function closeConfirmDialog() {
    confirmDialog.close();
  }

  confirmYes.addEventListener('click', () => {
    if (typeof onConfirm === 'function') onConfirm();
    closeConfirmDialog();
  });

  confirmNo.addEventListener('click', closeConfirmDialog);

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
    openConfirmDialog(() => {
      clearLocalData();
      clearData();
      document.querySelector('#clearResults').disabled = true;
      document.querySelector('#startRace').textContent = 'Start Race';
    });
  });

  document.querySelector('#submitResults').addEventListener('click', () => {
    saveResultLocally();
  });

  document.querySelector('#submitRacer').addEventListener('click', async () => {
    const racerInput = document.querySelector('#participant');
    count += 1;
    const id = count;
    const runnerName = racerInput.value.trim();
    const checkpoint = numFinish;

    if (runnerName !== '') {
      await updateRacer(id, runnerName, checkpoint);
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
    numCheckpoint = parseInt(document.querySelector('#checkpointLocation').value);
    numFinish = numCheckpoint + 1;
    const container = document.querySelector('#checkpointsContainer');
    const template = document.querySelector('#checkpointTemplate');

    container.innerHTML = '';

    if (isNaN(numCheckpoint) || numCheckpoint <= 0) {
      alert('Please enter a valid number of checkpoints.');
      return;
    }

    for (let i = 1; i <= numCheckpoint; i++) {
      const clone = template.content.cloneNode(true);
      const section = clone.querySelector('.checkpoint');

      section.dataset.checkpoint = i;

      clone.querySelector('.checkpoint-number').textContent = i;
      clone.querySelector('.checkpoint-button').dataset.checkpoint = i;
      clone.querySelector('.checkpoint-update').dataset.checkpoint = i;

      clone.querySelector('.times-list').id = `timesList-${i}`;

      container.appendChild(clone);
      checkpointData[i] = [];
    }
  });

  document.querySelector('#checkpointsContainer').addEventListener('click', function (event) {
    if (event.target.classList.contains('checkpoint-update')) {
      const checkpointSection = event.target.closest('.checkpoint');

      const checkpoint = parseInt(event.target.dataset.checkpoint);

      const racerNameInput = checkpointSection.querySelector('.racer-name');
      const racerName = racerNameInput.value;

      if (!addPressCounts[checkpoint]) {
        addPressCounts[checkpoint] = 1;
      } else {
        addPressCounts[checkpoint]++;
      }

      const idForThisEntry = addPressCounts[checkpoint];

      updateRacer(idForThisEntry, racerName, checkpoint);
      renderCheckpointRacers(checkpoint);

      racerNameInput.value = '';
    }

    if (event.target.classList.contains('checkpoint-button')) {
      const checkpoint = parseInt(event.target.dataset.checkpoint);
      checkpointData[checkpoint].push(elapsedTime);

      const checkpointSection = event.target.closest('.checkpoint');
      const timesList = checkpointSection.querySelector('.times-list');

      timesList.innerHTML = '';
      const sortedTimes = [...checkpointData[checkpoint]].sort();
      console.log('Checkpoint:', checkpoint);

      sortedTimes.forEach((time, index) => {
        const li = document.createElement('li');
        li.textContent = `Position ${index + 1} : ${time}`;
        timesList.appendChild(li);
      });

      addResult(elapsedTime, checkpoint);
    }
  });
}
