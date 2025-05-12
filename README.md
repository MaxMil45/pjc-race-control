# Race Time - by up2194201
## Key features
A race timing app designed for event organizers who need a seamless way to track and record race results. With a simple interface, the app allows users to start a race timer, log finish times for each runner, and submit results effortlessly.



### Key Feature Name/Description.
Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.  
The basic features of the app are:

. Start a race timer

. Record the finish time of each runner in that race

. Submit results to a server

. Clear race results from their device after the race

. Record race results on a phone that is in "airplane mode" - i.e. offline

. Store data from one race at a time.

. Provide timing for races up to 24 hours in length

. Upload race results to a server (either live during the race and/or as a batch upload afterwards if data is recorded in "airplane mode")

. Receive data from users

. Display race results

. Provide timely results (as data is uploaded or immediately after, so runners can see their official positions and times before they go home).


### Key Another Feature Name/Description.
Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.  

.
.
.
### Final Key Feature Name/Description.
Same for each feature… you get the idea :-)


## AI
Replace this with DETAIL about your use of AI, listing of the prompts you used, and whether the results formed or inspired part of your final submission and where we can see this (and if not, why not?). You may wish to group prompts into headings/sections - use markdown in any way that it helps you communicate your use of AI.  Tell us about what went right,  what went horribly wrong and what you learned from it.

What went wrong in the beggining was that varibales names were every similar to the point i was mistaking name for another varaible. This was further made worse with me using camal case most of the time however sometimes using snake case. This made some things go wrong where I would have raceName and racer_Name, this made my code look uneaderable to a nomal person looking at my code. I therefor changed all occurances with the help of eslint.   

How should I size buttons in a modern, responsive HTML/CSS web project? Should I use width and height, or is there a better way?


--------------------------------------------------------------------------------------------
While building the server-side API for logging race laps, I wrote the following input validation condition:

if (!time || !racer || checkpoint || date === undefined) {
  return res.status(400).json({ error: 'Missing time, racer, or checkpoint' });
}
Issue:
This logic was incorrect because checkpoint || date === undefined would always evaluate to true when checkpoint had any value (e.g., 1). This caused valid input to be rejected.

AI Prompt Used:

"This part of my server-side code is wrong: if (!time || !racer || checkpoint || date === undefined) – why is this a problem, and how can I fix it?"

AI Suggestion:
The AI explained the truthy/falsy behavior and suggested the corrected condition:

if (!time || !racer || checkpoint === undefined || date === undefined) {
  return res.status(400).json({ error: 'Missing time, racer, checkpoint, or date' });
}
Outcome:
This feedback clarified the problem, and I rewrote the logic in my own way with a clear understanding. The fix now appears in the route handler in server.js.

What Worked Well
Quick clarification of subtle JavaScript logic.

Helped me better understand how to write clean, accurate conditionals.

Accelerated debugging without sacrificing understanding or control.

What Didn’t Work
What I did was rely on it too fast, without looking properly for the obvious mistake. 

What I Learned
Always validate AI-generated code with your own understanding.

Generative AI is useful for learning and idea generation, but not a replacement for coding knowledge.

Maintainable code comes from refining AI output—not blindly using it.

--------------------------------------------------------------------------------------------

-------------------LeaderBoard-----------------------------
Every time i am trying to load my leardboard there an error like this when it is updating live

function.js:91 
 Uncaught TypeError: Cannot set properties of undefined (setting 'innerHTML')
    at renderLeaderboard (function.js:91:19)
    at addResult (function.js:211:3)
    at HTMLElement.<anonymous> (function.js:515:7)
renderLeaderboard	@	function.js:91
addResult	@	function.js:211
(anonymous)	@	function.js:515


-----------------AI Objects------------
Object.keys(addPressCounts).forEach(key => {
    addPressCounts[key] = 0;
  });

  Object.keys(checkpointData).forEach(key => {
    checkpointData[key] = [];
  });

--------------------------------------------------------------------------------------------

  *“How can I match a runner’s number to their name from an array of objects?”*

    const foundRunner = validRunners.find(runner => runner.number === runnerNumberInput);
-----------------------------------------------------------------
Uncaught TypeError: Cannot read properties of undefined (reading 'forEach')
    at updateUserList (function.js:618:25)
    at initializeAddUserListeners (function.js:633:3)
    at showAddUserTemplate (function.js:80:3)
    at HTMLButtonElement.<anonymous> (function.js:684:7)
updateUserList	@	function.js:618
initializeAddUserListeners	@	function.js:633
showAddUserTemplate	@	function.js:80
(anonymous)	@	function.js:684

I used ChatGPT as a second opinion to confirm and resolve a bug where .forEach was called on undefined. I had identified the error location but wanted guidance on best practices for handling missing data in localStorage.

Prompts used included:

“Uncaught TypeError: Cannot read properties of undefined (reading 'forEach')”

“Can you make this into local storage?”

“What should this look like?”

ChatGPT helped improve resilience by suggesting default fallbacks (e.g., races[selectedRace] || []) and reminding me to persist updates using saveRaces(). These suggestions directly influenced the final race creation and user registration features.

AI support was helpful, but all changes were reviewed and tested manually.

----------------------------------------------------
section.dataset.checkpoint = i;

      clone.querySelector('.checkpoint-number').textContent = i;
      clone.querySelector('.checkpoint-button').dataset.checkpoint = i;
      clone.querySelector('.checkpoint-update').dataset.checkpoint = i;

      clone.querySelector('.times-list').id = `timesList-${i}`;

      container.appendChild(clone);
      checkpointData[i] = [];

      renderCheckpointRacers(i);

      here
------------------------------------------------
how do you underline stuff

--------------------------------------------------

Used ai to find how to use Object.keys(races).forEach =>, instead of for loop

Object.keys(races).forEach(name => {
      const button = document.createElement('button');
      button.textContent = name;
      button.addEventListener('click', () => {
        selectedRace = name;
        showAddUserTemplate(); // Trigger rendering of add user screen
      });
      raceButtonsContainer.appendChild(button);
    });

-------------------------------------------------------

can you do the same for this so no matter if someone typed the name incorrectly to the capitals i would still remove

removeRaceBtn.addEventListener('click', () => {
    const name = raceNameInput.value.trim();
    deleteRace(name);
    renderRaceButtons();
  });

------------------------------------------------------------------------------

 <!-- const clearType = false;
    const openConfirmDialog = createConfirmDialog();
    if (isPaused && hasStarted) {
      openConfirmDialog((clearType) => { -->
  
----------------------------------------------------------
### Prompts to develop XYZ (example)
A sequence of prompts helped me develop this feature:

>  this is an example prompt given to a chatbot
The response was proved useless because the prompt wasn't specific enough about XYZ, so:

>  this is an example prompt given to a chatbot detailing XYZ
The response was better so I could specifically ask about QRST - this may evolve into a longer discussion highlighting some insight you gained… who knows where you might pick up marks!

>  how can I integrate QRST here?
The suggestion worked with minor modifications.

### Prompts to develop GHIJ (example)
For the GHIJ feature I ...

>  this is an example prompt given to a chatbot
words words words etc
