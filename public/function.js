// =======================
// Global Timer Variables
// =======================
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;
let racerName = 0;
let count = 0;
let isPaused = false;
let hasStarted = false;
let pausedTime = 0;
let numCheckpoint = 0;
let numFinish = 0;
const checkpointData = {};
const addPressCounts = {};
const races = {};
let selectedRace = '';

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
  initializeCreateEventListeners();
});

document.querySelector('#add').addEventListener('click', () => {
  const template = document.querySelector('#tmp-screen-add');
  const page = template.content.cloneNode(true);
  const content = document.querySelector('#pageContent');
  content.innerHTML = ''; // Clear previous content
  content.appendChild(page);

  // Initialize event listeners after rendering template
  initializeAddUserListeners();
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

  const id = results.length + 1;

  const runnerName = `Racer ${id}`;

  const RecordedTime = currentTime();

  const newResult = { id, runnerName, time, checkpoint, date: RecordedTime };

  // Add the new result to the list
  results.push(newResult);

  // Save the updated list back to local storage
  setLocalResults(results);
}


// =======================
// Clear Data
// =======================
function clearLocalData() {
  localStorage.removeItem('raceResults');
  racerName = 0;

  Object.keys(addPressCounts).forEach(key => {
    addPressCounts[key] = 0;
  });

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
    if (!hasStarted) {
      startTimer();
      hasStarted = true;
      isPaused = false;
      document.querySelector('#startRace').textContent = 'Pause';
      document.querySelector('#submitResults').disabled = false;
    } else if (!isPaused) {
      pauseTimer();
      document.querySelector('#startRace').textContent = 'Resume';
    } else {
      startTimer();
      isPaused = false;
      document.querySelector('#startRace').textContent = 'Pause';
    }
  });

  document.querySelector('#clearResults').addEventListener('click', () => {
    openConfirmDialog(() => {
      clearLocalData();
      clearData();
      document.querySelector('#startRace').textContent = 'Start Race';
    });
  });

  document.querySelector('#submitResults').addEventListener('click', () => {
    saveResultLocally();
  });

  document.querySelector('#submitRacer').addEventListener('click', async () => {
    const racerInput = document.querySelector('#participant');
    const runnerNumberInput = racerInput.value.trim();
    const checkpoint = numFinish;

    // Get registered runners in the selected race
    const validRunners = races[selectedRace] || [];

    // Check if input matches a valid runner number
    const foundRunner = validRunners.find(runner => runner.number === runnerNumberInput);

    if (!foundRunner) {
      alert('Invalid or unregistered runner number.');
      return;
    }

    count += 1;
    const id = count;
    const runnerName = foundRunner.name;

    await updateRacer(id, runnerName, checkpoint);
    racerInput.value = '';

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
    // Check if the clicked element is the 'checkpoint-update' button
    if (event.target.classList.contains('checkpoint-update')) {
      const checkpointSection = event.target.closest('.checkpoint');
      const checkpoint = parseInt(event.target.dataset.checkpoint);

      const racerNameInput = checkpointSection.querySelector('.racer-name');
      const racerNumber = racerNameInput.value; // Runner's number from the input

      const validRunners = races[selectedRace] || [];

      // Find the runner by number (racerNumber) in the valid runners list
      const foundRunner = validRunners.find(runner => runner.number === racerNumber);

      if (!foundRunner) {
        alert('Invalid or unregistered runner number.');
        return;
      }

      if (!addPressCounts[checkpoint]) {
        addPressCounts[checkpoint] = 1;
      } else {
        addPressCounts[checkpoint]++;
      }

      const idForThisEntry = addPressCounts[checkpoint];

      // Update the racer and render the checkpoint racers
      updateRacer(idForThisEntry, foundRunner.name, checkpoint);
      renderCheckpointRacers(checkpoint);

      // Clear the racer name input field after processing
      racerNameInput.value = '';
    }

    // Check if the clicked element is the 'checkpoint-button'
    if (event.target.classList.contains('checkpoint-button')) {
      const checkpoint = parseInt(event.target.dataset.checkpoint);

      // Add the current elapsed time to the checkpoint data
      checkpointData[checkpoint].push(elapsedTime);

      const checkpointSection = event.target.closest('.checkpoint');
      const timesList = checkpointSection.querySelector('.times-list');

      // Clear the current list of times
      timesList.innerHTML = '';

      // Sort the times and display them
      const sortedTimes = [...checkpointData[checkpoint]].sort();
      console.log('Checkpoint:', checkpoint);

      // Display the sorted times as a list
      sortedTimes.forEach((time, index) => {
        const li = document.createElement('li');
        li.textContent = `Position ${index + 1} : ${time}`;
        timesList.appendChild(li);
      });
      // Add the result for this checkpoint
      addResult(elapsedTime, checkpoint);
    }
  });
}

function initializeAddUserListeners() {
  const raceNameDisplay = document.querySelector('#raceNameDisplayAdd');
  const newUserNameInput = document.querySelector('#newUserName');
  const addUserBtn = document.querySelector('#addUser');
  const userList = document.querySelector('#userList');

  raceNameDisplay.textContent = selectedRace;

  function updateUserList() {
    userList.innerHTML = '';
    races[selectedRace].forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.name} (#${user.number})`;
      userList.appendChild(li);
    });
  }

  function generateUniqueNumber(existingNumbers) {
    for (let i = 1; i <= 999; i++) {
      const num = i.toString().padStart(3, '0');
      if (!existingNumbers.includes(num)) return num;
    }
    return null; // all numbers used
  }

  updateUserList();

  addUserBtn.addEventListener('click', () => {
    const name = newUserNameInput.value.trim();
    if (!name) return;

    const existingNumbers = races[selectedRace].map(u => u.number);
    const newNumber = generateUniqueNumber(existingNumbers);

    if (!newNumber) {
      alert('Maximum participants reached for this race (999).');
      return;
    }

    races[selectedRace].push({ name, number: newNumber });
    newUserNameInput.value = '';
    updateUserList();
  });
}


function initializeCreateEventListeners() {
  const raceSelect = document.querySelector('#existingRaces');
  const selectRaceBtn = document.querySelector('#selectRaceBtn');
  const createRaceBtn = document.querySelector('#createRaceBtn');
  const raceNameInput = document.querySelector('#raceName');

  // Update dropdown with current races
  raceSelect.innerHTML = '<option value="">Select a Race...</option>';
  Object.keys(races).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    raceSelect.appendChild(option);
  });

  raceSelect.addEventListener('change', () => {
    selectRaceBtn.disabled = !raceSelect.value;
  });

  selectRaceBtn.addEventListener('click', () => {
    selectedRace = raceSelect.value;
    document.querySelector('#add').click(); // Trigger rendering of add user screen
  });

  createRaceBtn.addEventListener('click', () => {
    const name = raceNameInput.value.trim();
    if (name && !races[name]) {
      races[name] = [];
      selectedRace = name;
      document.querySelector('#add').click(); // Trigger rendering of add user screen
    } else {
      alert('Enter a unique race name.');
    }
  });
}
