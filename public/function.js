// =======================
// Global Timer Variables
// =======================
let startTime = 0;
let elapsedTime = null;
let timerInterval = null;
let count = 0;
let isPaused = false;
let hasStarted = false;
let pausedTime = 0;
let numCheckpoint = 0;
let numFinish = 0;
const checkpointData = {};
const addPressCounts = {};
let selectedRace = '';
const finishQueue = [];

const pageOrder = ['#tmp-screen-create', '#tmp-screen-add', '#raceAppTemplate', '#leaderboardTemplate'];
let currentPageIndex = 1;


// =======================
// Page Template Loading
// =======================

document.addEventListener('DOMContentLoaded', () => {
  showCreateRaceTemplate(); // Load on startup

  if (!localStorage.getItem('cookieConsent')) {
    document.getElementById('cookieConsent').style.display = 'flex';
  }

  document.querySelector('#acceptCookiesBtn').addEventListener('click', acceptCookies);
  document.querySelector('#acceptNecessaryBtn').addEventListener('click', acceptNecessary);
});

function loadPageByIndex(index) {
  const template = document.querySelector(pageOrder[index]);
  if (!template) return;
  const page = template.content.cloneNode(true);
  const content = document.querySelector('#pageContent');
  content.innerHTML = '';
  content.appendChild(page);

  currentPageIndex = index;

  // Call correct initializer based on page
  switch (pageOrder[index]) {
    case '#tmp-screen-create':
      initializeCreateEventListeners();
      break;
    case '#tmp-screen-add':
      initializeAddUserListeners();
      break;
    case '#raceAppTemplate':
      initializeRaceEventListeners();
      break;
    case '#leaderboardTemplate':
      initializeLeaderboardPage();
      break;
  }
}


// =======================
// Render Race Page Template
// =======================

function showCreateRaceTemplate() {
  const template = document.querySelector('#tmp-screen-create');
  const page = template.content.cloneNode(true);
  const content = document.querySelector('#pageContent');
  content.innerHTML = ''; // Clear previous content
  content.appendChild(page);

  initializeCreateEventListeners();
}

function showAddUserTemplate() {
  const template = document.querySelector('#tmp-screen-add');
  const page = template.content.cloneNode(true);
  const content = document.querySelector('#pageContent');
  content.innerHTML = ''; // Clear previous content
  content.appendChild(page);

  // Initialize event listeners after rendering template
  initializeAddUserListeners();
  loadPageByIndex(1);
}

// Back button function clearing data

document.addEventListener('click', (e) => {
  if (e.target.id === 'backBtn') {
    const nextIndex = currentPageIndex - 1;

    if (nextIndex === 0) {
      const clearTypeRace = true;
      const openConfirmDialog = createConfirmDialog(clearTypeRace);
      openConfirmDialog(() => {
        clearLocalData();
        clearData();
        loadPageByIndex(nextIndex); // Now navigate after confirmation
      });
    } else if (nextIndex >= 0) {
      loadPageByIndex(nextIndex);
    }
  }

  if (e.target.id === 'forwardBtn') {
    if (currentPageIndex < pageOrder.length - 1) {
      loadPageByIndex(currentPageIndex + 1);
    }
  }
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

// Helper to get races from localStorage
function getRaces() {
  return JSON.parse(localStorage.getItem('races')) || {};
}

// Helper to save races to localStorage
function saveRaces(races) {
  localStorage.setItem('races', JSON.stringify(races));
}

// Cookie Consent Functions
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'all');
  document.getElementById('cookieConsent').style.display = 'none';
}

function acceptNecessary() {
  localStorage.setItem('cookieConsent', 'necessary');
  document.getElementById('cookieConsent').style.display = 'none';
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

    // Update the timer display if the timer element exists
    const timerElement = document.querySelector('#timer');
    if (timerElement) {
      timerElement.innerHTML = elapsedTime;
    }
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
function addResult(time, checkpoint) {
  const results = getLocalResults();

  // Filter only results for the current checkpoint
  const checkpointResults = results.filter(res => res.checkpoint === checkpoint);

  // ID based on how many entries exist at this checkpoint
  const id = checkpointResults.length + 1;

  const runnerName = `Racer ${id}`;
  const RecordedTime = currentTime();
  const newResult = { id, runnerName, time, checkpoint, date: RecordedTime };

  // Add the new result to the list
  results.push(newResult);

  // Save the updated list back to local storage
  setLocalResults(results);
}

async function submitToServer() {
  const results = getLocalResults();

  if (!results || results.length === 0) {
    console.log('No results to submit!');
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
  // localStorage.removeItem('raceResults');
  renderRacerResults(numFinish, '#finishTimes');
}

function updateRacer(id, runnerName, checkpoint) {
  const results = getLocalResults();

  const updated = results.map((res) =>
    res.id === id && res.checkpoint === checkpoint ? { ...res, runnerName } : res,
  );

  setLocalResults(updated);
  renderRacerResults(numFinish, '#finishTimes');
}

// Function to render finish times
function renderRacerResults(checkpoint, containerSelector = null) {
  const results = getLocalResults();

  let container;
  if (containerSelector) {
    container = document.querySelector(containerSelector);
  } else {
    // Default to the times-list inside the checkpoint section
    container = document.querySelector(`.checkpoint[data-checkpoint="${checkpoint}"] .times-list`);
  }

  if (!container) return;

  container.innerHTML = '';

  const ul = document.createElement('ul');
  results
    .filter(result => result.checkpoint === checkpoint)
    .forEach(result => {
      const li = document.createElement('li');
      li.textContent = `${result.runnerName}: ${result.time}`;
      ul.appendChild(li);
    });

  container.appendChild(ul);
}

// =======================
// Dialog Functions
// =======================

function createConfirmDialog(clearTypeRace) {
  const confirmDialog = document.querySelector('#confirmDialog');
  const confirmYes = document.querySelector('#confirmYes');
  const confirmNo = document.querySelector('#confirmNo');
  const confirmText = document.querySelector('#confirmText');

  let onConfirm = null;

  if (clearTypeRace) {
    confirmText.textContent = 'To go back to the first page, all data will be cleared. Do you want to continue?';
  } else {
    confirmText.textContent = 'Are you sure you want to clear all race results?';
  }

  confirmYes.addEventListener('click', () => {
    if (typeof onConfirm === 'function') onConfirm();
    confirmDialog.close();
  });

  confirmNo.addEventListener('click', () => confirmDialog.close());

  return function open(callback) {
    onConfirm = callback;
    confirmDialog.showModal();
    confirmYes.focus();
  };
}

// =======================
// Clear Data
// =======================
function clearLocalData() {
  localStorage.removeItem('raceResults');

  Object.keys(addPressCounts).forEach(key => {
    addPressCounts[key] = 0;
  });

  Object.keys(checkpointData).forEach(key => {
    checkpointData[key] = [];
  });

  document.querySelectorAll('.times-list').forEach(list => {
    list.innerHTML = '';
  });

  finishQueue.length = 0;

  localStorage.removeItem('numCheckpoint');

  count = 0;

  renderRacerResults(numFinish, '#finishTimes');
  stopTimer();
}

// Function to clear data from the server
async function clearData() {
  const res = await fetch('http://localhost:8080/api/clearRaceResults', {
    method: 'DELETE',
  });

  if (!res.ok) {
    console.error(`Failed to clear: ${res.status}`);
    return;
  }

  const data = await res.json();
  console.log(data.message);
}

// =======================
// Dynamic Event Listener Initialization
// =======================

function initializeRaceEventListeners() {
  renderRacerResults(numFinish, '#finishTimes');

  // Load the number of checkpoints from localStorage saved in the previous session
  const savedNumCheckpoint = parseInt(localStorage.getItem('numCheckpoint'));
  const checkpointInput = document.querySelector('#checkpointLocation');
  const generateButton = document.querySelector('#generateTables');

  if (savedNumCheckpoint > 0 && checkpointInput && generateButton) {
    checkpointInput.value = savedNumCheckpoint;

    // Delay the click to ensure DOM elements exist
    setTimeout(() => generateButton.click(), 0);
  }

  // Event listener for the "Start button"
  document.querySelector('#startRace').addEventListener('click', () => {
    if (!hasStarted) {
      startTimer();
      hasStarted = true;
      isPaused = false;
      document.querySelector('#startRace').textContent = 'Pause';
    } else if (!isPaused) {
      pauseTimer();
      document.querySelector('#startRace').textContent = 'Resume';
    } else {
      startTimer();
      isPaused = false;
      document.querySelector('#startRace').textContent = 'Pause';
    }
  });

  // Event listener for the "Clear Results" button
  document.querySelector('#clearResults').addEventListener('click', () => {
    const clearTypeRace = false;
    const openConfirmDialog = createConfirmDialog(clearTypeRace);
    if (isPaused && hasStarted) {
      openConfirmDialog(() => {
        clearLocalData();
        clearData();
      });
      document.querySelector('#startRace').textContent = 'Start Race';

      // Check point input reset
      const checkpointLocation = document.querySelector('#checkpointLocation');
      checkpointLocation.value = '';
      document.querySelector('#errorMessage').textContent = '';
    } else {
      document.querySelector('#errorMessage').hidden = false;
      document.querySelector('#errorMessage').textContent = 'Please pause the timer before clearing results.';
    }
  });

  // Event listener for the "Finish Record Time" button
  document.querySelector('#submitResults').addEventListener('click', () => {
    finishQueue.push(true);

    addResult(elapsedTime, numFinish);
    renderRacerResults(numFinish, '#finishTimes');
  });

  // Event listener for the "Record Time" button
  document.querySelector('#submitRacer').addEventListener('click', async () => {
    const races = getRaces();

    if (finishQueue.length === 0) {
      console.log('Please press the "Record Time" button before submitting a runner.');
      return;
    }
    finishQueue.shift();

    const racerInput = document.querySelector('#participant');
    const runnerNumberInput = racerInput.value.trim();
    const checkpoint = numFinish;

    // Get registered runners in the selected race
    const validRunners = races[selectedRace] || [];

    // Check if input matches a valid runner number
    const foundRunner = validRunners.find(runner => runner.number === runnerNumberInput);

    if (!foundRunner) {
      console.log('Invalid or unregistered runner number.');
      return;
    }

    count += 1;
    const id = count;
    const runnerName = foundRunner.name;

    await updateRacer(id, runnerName, checkpoint);
    racerInput.value = '';

    renderRacerResults(numFinish, '#finishTimes');
  });

  // Event listener for the "Export Results" button
  document.querySelector('#exportResults').addEventListener('click', () => {
    window.location.href = 'http://localhost:8080/api/exportRaceResults';
  });

  // Event listener for the "Send Data" button to the database
  document.querySelector('#sendData').addEventListener('click', async () => {
    await submitToServer();
    document.querySelector('#exportResults').hidden = false;
  });

  // Event listener for the "Generate Tables" button
  document.querySelector('#generateTables').addEventListener('click', () => {
    const inputValue = parseInt(document.querySelector('#checkpointLocation').value);
    numCheckpoint = parseInt(inputValue);
    localStorage.setItem('numCheckpoint', inputValue);

    numFinish = numCheckpoint + 1;
    const container = document.querySelector('#checkpointsContainer');
    const template = document.querySelector('#checkpointTemplate');

    container.innerHTML = '';

    if (isNaN(numCheckpoint)) {
      console.log('Please enter a valid number of checkpoints.');
      return;
    }

    if (numCheckpoint === 0) {
      container.innerHTML = '';
    }

    // Based on the number of checkpoints, create the sections
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

      renderRacerResults(i);
    }
  });

  // Event delegation for dynamically created elements
  document.querySelector('#checkpointsContainer').addEventListener('click', function (event) {
    const races = getRaces();
    // Check if the clicked element is the 'checkpoint-update' button
    if (event.target.classList.contains('checkpoint-update')) {
      const checkpointSection = event.target.closest('.checkpoint');
      const checkpoint = parseInt(event.target.dataset.checkpoint);

      // Check if the checkpoint data is available and if the racer name input is valid
      if (!checkpointData[checkpoint] || checkpointData[checkpoint].length <= (addPressCounts[checkpoint] || 0)) {
        console.log('Please press the "Record Time" button before updating a user.');
        return;
      }

      // Get the racer name input field
      const racerNameInput = checkpointSection.querySelector('.racer-name');
      const racerNumber = racerNameInput.value;

      // Check if the racer number is valid
      const validRunners = races[selectedRace] || [];
      const foundRunner = validRunners.find(runner => runner.number === racerNumber);

      if (!foundRunner) {
        console.log('Invalid or unregistered runner number.');
        return;
      }

      if (!addPressCounts[checkpoint]) {
        addPressCounts[checkpoint] = 1;
      } else {
        addPressCounts[checkpoint]++;
      }

      const idForThisEntry = addPressCounts[checkpoint];

      // Update the racer name in the results
      updateRacer(idForThisEntry, foundRunner.name, checkpoint);
      renderRacerResults(checkpoint);
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
      renderRacerResults(checkpoint);
    }
  });
}

// =======================
// Add User Page Functions
// =======================

function initializeAddUserListeners() {
  const raceNameDisplay = document.querySelector('#raceNameDisplayAdd');
  const newUserNameInput = document.querySelector('#newUserName');
  const addUserBtn = document.querySelector('#addUser');
  const userList = document.querySelector('#userList');

  raceNameDisplay.textContent = selectedRace;

  // Function to update the user list based on the selected
  function updateUserList() {
    const races = getRaces();
    userList.innerHTML = '';

    const users = races[selectedRace] || [];
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.name} (#${user.number})`;
      userList.appendChild(li);
    });
  }

  // Function to generate a ordered unique number for the user
  function generateUniqueNumber(existingNumbers) {
    for (let i = 1; i <= 999; i++) {
      const num = i.toString().padStart(3, '0');
      if (!existingNumbers.includes(num)) return num;
    }
    return null; // all numbers used
  }

  updateUserList();

  // Add user button calls add function then updates page
  addUserBtn.addEventListener('click', () => {
    const races = getRaces();
    const name = newUserNameInput.value.trim();
    if (!name) return;

    if (!races[selectedRace]) {
      races[selectedRace] = [];
    }

    const existingUsers = races[selectedRace];

    // Normalize input to lowercase for comparison
    const nameLower = name.toLowerCase();

    // Check for duplicate usernames (case-insensitive)
    const duplicate = existingUsers.some(user => user.name.toLowerCase() === nameLower);

    if (duplicate) {
      console.log('Username already exists.');
      return;
    }

    const existingNumbers = existingUsers.map(u => u.number);
    const newNumber = generateUniqueNumber(existingNumbers);

    if (!newNumber) {
      console.log('Maximum participants reached for this race (999).');
      return;
    }

    // Add the user
    existingUsers.push({ name, number: newNumber });

    // Save to localStorage
    saveRaces(races);

    newUserNameInput.value = '';

    // Update the user list
    updateUserList();
  });
}

// =======================
// Create Races page functions
// =======================

function initializeCreateEventListeners() {
  const raceButtonsContainer = document.querySelector('#raceButtons');
  const createRaceBtn = document.querySelector('#createRaceBtn');
  const raceNameInput = document.querySelector('#raceName');
  const removeRaceBtn = document.querySelector('#removeRaceBtn');

  function renderRaceButtons() {
    raceButtonsContainer.innerHTML = '';
    const races = getRaces();

    // Gets all the races from localStorage
    Object.keys(races).forEach(name => {
      const button = document.createElement('button');
      button.textContent = name;
      button.addEventListener('click', () => {
        selectedRace = name;
        showAddUserTemplate(); // Trigger rendering of add user screen
      });
      raceButtonsContainer.appendChild(button);
    });
  }

  // Create button calls create function then updates page
  createRaceBtn.addEventListener('click', () => {
    const races = getRaces();
    const name = raceNameInput.value.trim();

    const existingNames = Object.keys(races).map(r => r.toLowerCase());

    if (name && !existingNames.includes(name.toLowerCase())) {
      races[name] = [];

      // Save the new race to localStorage
      saveRaces(races);
      selectedRace = name;

      // Trigger rendering of add user screen
      showAddUserTemplate();
    } else {
      console.log('Enter a unique race name.');
    }
  });

  // Remove button calls delete function then updates page
  removeRaceBtn.addEventListener('click', () => {
    const name = raceNameInput.value.trim();
    deleteRace(name);
    renderRaceButtons();
    raceNameInput.value = '';
  });

  renderRaceButtons();

  // Function to delete the race
  function deleteRace(raceName) {
    // Get current races from localStorage
    const races = getRaces();

    if (races[raceName]) {
      // Remove the race by name
      delete races[raceName];
      // Save the updated list back to localStorage
      saveRaces(races);
      console.log(`${raceName} has been deleted.`);
    } else {
      console.log('Race not found.');
    }
  }
}

// =======================
// Leaderboard Page Initialization
// =======================

function initializeLeaderboardPage() {
  const tbody = document.querySelector('#leaderboardBody');
  if (tbody) {
    // Render the leaderboard when the page is loaded
    renderLeaderboard(tbody);
  } else {
    console.error('Leaderboard table body not found.');
  }
}

// =======================
// Render Learder Board Functions
// =======================
function renderLeaderboard(tbody) {
  const results = getLocalResults();
  tbody.innerHTML = ''; // Clear old content

  if (results.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4">No results to display.</td>';
    tbody.appendChild(row);
    return;
  }

  // Group results by runner name
  const runnerGroups = {};
  results.forEach(res => {
    if (res.runnerName.includes('Racer')) {
      return;
    }

    if (!runnerGroups[res.runnerName]) {
      runnerGroups[res.runnerName] = [];
    }
    runnerGroups[res.runnerName].push(res);
  });

  // Convert grouped runners to array and sort by highest checkpoint
  const groupedArray = Object.entries(runnerGroups).sort(([, a], [, b]) => {
    const maxA = Math.max(...a.map(r => r.checkpoint));
    const maxB = Math.max(...b.map(r => r.checkpoint));
    return maxB - maxA;
  });

  let rank = 1;
  groupedArray.forEach(([runnerName, entries]) => {
    // Create main row with summary info
    const mainRow = document.createElement('tr');
    const detailsCell = document.createElement('td');
    detailsCell.colSpan = 4;

    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.innerHTML = `
      <strong>Rank ${rank}</strong> – <strong>${runnerName}</strong>
    `;
    details.appendChild(summary);

    // Create a list of this runner's checkpoint times
    const list = document.createElement('ul');
    entries.sort((a, b) => a.checkpoint - b.checkpoint);
    entries.forEach(e => {
      if (e.checkpoint === numFinish) {
        const finishTime = document.createElement('strong');
        finishTime.textContent = `Finish Time: ${e.time}`;
        list.appendChild(finishTime);
      } else {
        const item = document.createElement('li');
        item.textContent = `Checkpoint ${e.checkpoint}: ${e.time}`;
        list.appendChild(item);
      }
    });

    details.appendChild(list);
    detailsCell.appendChild(details);
    mainRow.appendChild(detailsCell);
    tbody.appendChild(mainRow);

    rank++;
  });
}
