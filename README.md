# Race Time - by up2194201
## Key features
A race timing app designed for event organisers who need a seamless way to track and record race results. With a simple interface, the app allows users to start a race timer, log finish times for each runner, and submit results effortlessly.

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


. Provide buttons to go back on forward through pages


. Able to create and remove a race


. Availability to add users to the race


. Add names to runners in the order of position


. Add Checkpoints


. Cookie Consent


### Start Button.
Tell us briefly how to find & use it.
The start button is on the Race Control page called 'Start'. To use it involves pressing the button to start the timer. This then changes the start button to have pause instead, to press it again indicating the pause feature which stops the timer and changes it to resume text on the button.

Describe the thinking behind the design of this feature.
The thinking behind this feature is that the one button can be used to call 3 different functions in one which allows more clean design for users.


## Finish Time Recording
Tell us briefly how to find & use it:
Once a race has started from the Race Control page, the user can find the button at the bottom of the page called 'Finish Times'. Here, they can press the finish times button which saves the position and time of the live stop watch thus appears below underneath it displaying the results to the application.

Describe the thinking behind the design of this feature:
This feature allows the time capture at the right moment and shows the user the live position and time updates allowing for optimal tracking with data while showing the users as well. Furthermore it is shown in the leaderboard page where it shows certain users and their.


## Submit Results to a Server
Tell us briefly how to find & use it:
On the 'Results' page, after recording finish times and checkpoints, a 'Send Data' button allows the user to upload all stored results to the server when there is an internet connection. This is done in batch type where everything is sent at once.

Describe the thinking behind the design of this feature:
Allows for users to have all of the data before it is sent off to the database, all at once. Allowing for exporting data from the database.


## Clear Race Results
Tell us briefly how to find & use it:
After submitting results, users can tap the 'Clear Results' button on the Race Control page to remove all local race data, stop the timer to then reset it to 0. After confirming it with a confirm dialog appearing.

Describe the thinking behind the design of this feature:
Allows users to get rid of useless data, where it prevents clutter and allows for only essential information to be shown.


### Offline Recording
Tell us briefly how to find & use it:
The app can record results even with no internet connection. Simply use all core race features (start, finish, input bib numbers) while offline. Data is saved locally.

Describe the thinking behind the design of this feature:
Designed for remote areas with no or limited connectivity. Data integrity is preserved and can be uploaded later.


### Store One Race at a Time
Tell us briefly how to find & use it:
When creating a new race, the app will prompt you to confirm deleting the race once you try to change the race to another one. Only one race’s data is stored at a time.

Describe the thinking behind the design of this feature:
Simplifies the app’s memory usage, and doesn't allow too many simultaneous actions happening at once.


### 24-Hour Race Timing Support
Tell us briefly how to find & use it:
On the race control page, races can be started and run for up to 24 hours. The timer is set up as 00:00:00:00 format that allows for tracking up to all hours and milliseconds.

Describe the thinking behind the design of this feature:
Ensures reliable times for all runners across the app for all stages of the race.


### Upload Batch
Tell us briefly how to find & use it:
Sending data to the server is only done by a batch upload, this ensures consistency across the method of uploading data.

Describe the thinking behind the design of this feature:
Batch upload ensures all races can be handled regardless of internet access. Provides convenience and flexibility.


### Receive Data from Users
Tell us briefly how to find & use it:
When users submit results from different sections like checkpoint and finish line, the local storage receives and processes this data via the 'Submit Results' function.

Describe the thinking behind the design of this feature:
This feature is useful as data is stored from the user where it can be changed before sending it over to the server. This allows for the race to be track optimally


### Display Race Results
Tell us briefly how to find & use it:
Navigate the results there are 2 ways to do so, the leaderboard page where the data is sent and organised for users. Lastly, after sending the data the export button can be pressed which has everything saved in a csv file.

Describe the thinking behind the design of this feature:
Provides transparency and instant feedback. Helps runners and staff quickly verify race outcomes.


### Timely Results Display
Tell us briefly how to find & use it:
Results are automatically shown on the race control page as they are submitted. Users can see real time updates after the action is done underneath the 'Record Time' button.

Describe the thinking behind the design of this feature:
Ensures runners get their official times quickly.


### Pagination Buttons
Tell us briefly how to find & use it:
On the results table page, users can navigate using 'Back' and 'Race Timer', 'Results' buttons to change the view for specific functions.

Describe the thinking behind the design of this feature:
Keeps the interface tidy and user-friendly. Allows users to know which functions they are supposed to use, as a sequence.


### Create and Remove Races
Tell us briefly how to find & use it:
From the loaded screen, You can either add a name in the input field to either create or delete an existing one. Or select a previously existing one.

Describe the thinking behind the design of this feature:
Allows races to be stored with the users added and able to remove the races with the users inside. This helps keep track of races that are and not needed.


### Add Users to a Race
Tell us briefly how to find & use it:
On the add users page, users can be added manually to then get a certain 3 digit code that is now linked to the user.

Describe the thinking behind the design of this feature:
This allows for easy tracking with a runner, and keeping the race up to date of tracking.


### Add Runner Names by Position
Tell us briefly how to find & use it:
As each runner’s time is recorded, their number is automatically associated with their checkpoints, finish time and position.

Describe the thinking behind the design of this feature:
This allows for easy to use tracking as runners can have their name inputted without affecting their time

### Add Checkpoints
Tell us briefly how to find & use it:
Checkpoints are inputted and loaded once the user inputs a valid number then presses the 'add' button which displays the newly updated checkpoints.

Describe the thinking behind the design of this feature:
The thinking behind this is that the users can be tracked with their time progression in an easy and simple way.

### Cookie confirmation
Tell us briefly how to find & use it:
A cookie is found at the bottom of the screen where it asks for permission to store data for the user to accept.

Describe the thinking behind the design of this feature:
The thinking behind the idea was that I was told it was necessary for there to be this feature if there was local storage in the code saving data.


## AI
Replace this with DETAIL about your use of AI, listing of the prompts you used, and whether the results formed or inspired part of your final submission and where we can see this (and if not, why not?). You may wish to group prompts into headings/sections - use markdown in any way that it helps you communicate your use of AI.  Tell us about what went right,  what went horribly wrong and what you learned from it.


--------------------------------------------------------------------------------------------
### LeaderBoard


I used AI to revise my leaderboard JavaScript that was giving me errors when I tried to update it. Specifically, I encountered an "Uncaught TypeError: Cannot set properties of undefined (setting 'innerHTML')" error and I asked the AI why it is producing this error. The AI told me there was a problem in the DOM element not yet created which helped me remember that the leadboard was in a different template so it can update if it is not loaded. This helped me change my plan for the leaderboard and how I would load it. The whole process was smooth—I received a clear explanation, prompt feedback, and an applicable solution. I learnt of the power of AI in swiftly finding live code front-end problems.


-------------------------------------------------------------------------
### .find()


  *“How can I match a runner’s number to their name from an array of objects?”*


    const foundRunner = validRunners.find(runner => runner.number === runnerNumberInput);


I used AI to find a link between the names on a marathon final tally and the numbers chosen from a list of participants. I asked "How can I match a runner’s number to their name from an array of objects?" and the AI suggested applying .find() with a callback function. So I received a code line: const foundRunner = validRunners.find(runner => runner.number === runnerNumberInput); that was very helpful and I applied it in the project to find and expose the name of the corresponding runner according to the number. It allowed me to not only implement it in a short amount of time but also understand the mechanics of .find() in relation to object arrays.


-----------------------------------------------------------------
### .dataset


I used AI to understand how to use the .dataset property in html elements with custom data. AI helped me set ".dataset.checkpoint = i;" on each checkpoint section and its child elements, so I could easily track which checkpoint each element referred to. This made it much easier to manage updates and render race data dynamically. It was, therefore, easier for me to handle the interactions, and the update times were less.


------------------------------------------------
### Underline


I asked AI how to underline text in CSS. It told me quickly to use text-decoration: underline;. I used this in my project underline the heading of the race name in the add user page. It was a quick solution that improved readability, and it helped me better understand small css properties.


--------------------------------------------------
### For loop


I used AI to learn how to replace a normal for loop with Object.keys().forEach, this was much easier and more readable code. Instead of using for (let i = 0; i < cars.length; i + +), I used Object.keys(races).forEach(name => { ... }) which helped create the buttons for each race saved. This added more consistency in my code where I had instead learnt why and how I should use certain loops and their purposes


-------------------------------------------------------
### Cookie Consent


I used AI to help implement a basic cookie consent system. I was saving data to localStorage. I needed to show a banner for the user to choose their option. AI gave me the idea to check if the consent was agreed in localStorage. It  explained how to use DOMContentLoaded so the JavaScript wouldn’t run before the HTML loaded, which fixed issues with event listeners not working. The final result worked well, and I learned how to manage timing in the DOM and store consent properly across sessions.


------------------------------------------------------------------------------
### Case Page switch


I used AI to help simplify problems with back and forth with the pages. Initially, I was using multiple if/else if conditions to check the value of pageOrder[index] and initialize the corresponding event listeners or pages. I asked AI if there was a different approach, and it recommended using a switch statement. After that, I asked how to make it even simpler, and the AI helped me streamline the logic further, making the code more concise and readable. This guidance helped me write cleaner and more maintainable code.


To go from this
if (pageOrder[index] === '#tmp-screen-create') {
  initializeCreateEventListeners();
} else if (pageOrder[index] === '#tmp-screen-add') {
  initializeAddUserListeners();
} else if (pageOrder[index] === '#raceAppTemplate') {
  initializeRaceEventListeners();
} else if (pageOrder[index] === '#leaderboardTemplate') {
  initializeLeaderboardPage();
}


To this
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

