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


🔴 Problem:
This part of your server-side code is wrong:

if (!time || !racer || checkpoint || date === undefined) {
  return res.status(400).json({ error: 'Missing time, racer, or checkpoint' });
}

checkpoint || date === undefined will always evaluate to true if checkpoint has any value, even a valid one like 1, because JavaScript treats non-zero numbers as truthy.

✅ Fix it like this:

if (!time || !racer || checkpoint === undefined || date === undefined) {
  return res.status(400).json({ error: 'Missing time, racer, checkpoint, or date' });
}
Now it correctly checks that all four values are present.

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
