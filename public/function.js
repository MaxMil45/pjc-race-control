fetch('/api/test')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Fetch error:", error));

let startTime = 0;
let endTime = 0;

document.querySelector('#startRace').addEventListener('click', () => {
    startTime = Date.now();
    document.querySelector("#finishTimes").innerHTML = "";
    document.querySelector("#recordFinish").disabled = false;
    document.querySelector("#submitResults").disabled = true;
    document.querySelector("#clearResults").disabled = false;
});
