let activeCount = 0; // Variable to track the number of active (toggled on) divs
let MultScore = 100;
let score = 0
let timer = false
let LowPerformance = false


let TimerStart = new Date();
let count = 0

document.addEventListener('DOMContentLoaded', function () {
    // Stopwatch Buttons
    let startB = document.getElementById('swstart');
    let stopB = document.getElementById('swstop');
    let resetB = document.getElementById('swreset');
    let lowPerfB = document.getElementById('swlow');
    document.querySelector('.modifiermultvalue').textContent = "x1.00";
    const ActiveMods = document.querySelector('.displaymods');
    const placeholder = document.querySelector('.nomods');
    let timecalib = document.querySelector('#timeset');
    MultScore = 100;
    updateActivatedMods();

    // Function to update the activated Mods inside of the Visualizer
    function updateActivatedMods() {
      // Get all active mods
      const activeImages = document.querySelectorAll('.modicon[data-active="true"]');

      // Clear the activated container
      ActiveMods.innerHTML = '';

      // If there are no active images, show the placeholder
      if (activeImages.length === 0) {
        placeholder.style.display = 'block';
        ActiveMods.appendChild(placeholder);
      } else {
        placeholder.style.display = 'none'; // Hide the placeholder
        // Loop through all active images and display them in the activated container
        activeImages.forEach(activeImageDiv => {
          const img = activeImageDiv.querySelector('img');
          const clonedImg = activeImageDiv.cloneNode(true); // Clone the image to display in the activated container
          clonedImg.classList.add('activated-image');
          clonedImg.classList.remove('modicon');
          clonedImg.classList.add('modiconclone');
          ActiveMods.appendChild(clonedImg);
        });
      }
    }

    // Refreshing the score whenever Mult or Time updates
    function setScore() {
      if ((count/1000) < 7200) {
        score = Math.floor((0.0339506175 * ((count/1000-7200) ** (2))) * (MultScore/100)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
      } else {
        score = 0
      }
      if (count === 0) {
        document.getElementById('scoredisplay').innerHTML = "-,---,---";
        return;
      }
      document.getElementById('scoredisplay').innerHTML = score;
    }

    // Function to calculate and update the total score
    function calculateTotalScoreMultiplier() {
      MultScore = 100; // Reset total score
      // Loop over each image-div
      let RelevantMods = 0
      let RelevantModsList = ["1","2","3","4","5","6","7","8","9","21"]
      let MultiplayerAmplifier = 1
      document.querySelectorAll('.modicon').forEach(
        div => {
          const isActive = div.getAttribute('data-active') === 'true'; // Check if active
          const ModScore = parseInt(div.getAttribute('data-score')); // Get the mod score
          if (isActive) {
            if (RelevantModsList.includes(div.getAttribute('data-id'))) {
              RelevantMods += 1
            }
            if (["12","13","14","15","16","17","18"].includes(div.getAttribute('data-id'))) {
              MultiplayerAmplifier = MultiplayerAmplifier + RelevantMods
            }
            MultScore += ModScore * MultiplayerAmplifier; // Add score if image is toggled on
          }
        }
      );
      // Apply any special conditions after all the scores are calculated
      const mod1 = document.querySelector('.modicon[data-id="10"]');
      const mod2 = document.querySelector('.modicon[data-id="19"]');
      if (mod1.getAttribute('data-active') === 'true') {
        MultScore /= 2;
      }
      if (mod2.getAttribute('data-active') === 'true') {
        MultScore /= 10;
      }      
      // Update the score display
      document.querySelector('.modifiermultvalue').textContent =  `x${(MultScore / 100).toFixed(2)}`;
      if (MultScore === 100) {
        document.querySelector('.modifiermultvalue').style.color = 'white';
      } else {
        if (MultScore < 100) {
          document.querySelector('.modifiermultvalue').style.color = "#ff5454";
        } else { 
          document.querySelector('.modifiermultvalue').style.color = "#56ff72";
        }
      }
      setScore();
      updateActivatedMods();
      console.log(RelevantMods)
    }

    // Function to disable incompatible mods
    function disableIncompatibleMods(currentModifierDiv) {
        const incompatibleList = currentModifierDiv.getAttribute('data-incompatible');
      
        // If no incompatibilities, skip disabling logic
        if (!incompatibleList || incompatibleList === '[]') {
          return;
        }
      
        // Parse the list of incompatible image IDs if it's not empty
        const incompatibleArray = JSON.parse(incompatibleList);
        
        incompatibleArray.forEach(incompatibleId => {
          const incompatibleDiv = document.querySelector(`.modicon[data-id="${incompatibleId}"]`);
          
          if (incompatibleDiv) {
            incompatibleDiv.classList.add('disabled'); // Disable the incompatible image
            incompatibleDiv.setAttribute('data-active', 'false'); // Set as inactive
            incompatibleDiv.classList.remove('toggled-on'); // Remove toggled-on class
          }
        });
        // Recalculate the total score after disabling incompatible images
        calculateTotalScoreMultiplier();
    }

    // Function to toggle off all active images
    function resetAllMods() {
      // Loop over each image-div and toggle off all active ones
      document.querySelectorAll('.modicon').forEach(div => {
        const isActive = div.getAttribute('data-active') === 'true';
        
        if (isActive) {
          div.classList.remove('toggled-on'); // Remove the toggled-on class
          div.setAttribute('data-active', 'false'); // Set data-active to false
        }

        // Also ensure any disabled image is reset
        div.classList.remove('disabled'); // Remove the disabled class
      });

      // Recalculate the total score after resetting all images
      calculateTotalScoreMultiplier();
    }

    // Set up event listeners for the image divs
    document.querySelectorAll('.modicon').forEach(
      div => {
        div.addEventListener('click', function () {
            const isActive = this.getAttribute('data-active') === 'true';
            if (isActive) {
              this.classList.remove('toggled-on'); // Remove toggled-on class
              this.setAttribute('data-active', 'false'); // Set as inactive
            } else {
              this.classList.add('toggled-on'); // Add toggled-on class
              this.setAttribute('data-active', 'true'); // Set as active
            }            // Recalculate total score after the click
            // Disable incompatible images
            disableIncompatibleMods(this);
            calculateTotalScoreMultiplier();
          }
        );
      }
    );
    
    // Stopwatch Main Function
    function stopWatch() {
      if (timer) {
        document.getElementById('timeset').innerHTML = ""
        document.getElementById('swstart').innerHTML = `<span class="modsubtext">Continue</span>`;
        let current = new Date();
        count = +current - +TimerStart;

        let ms = count % 1000;
        let s = Math.floor((count /  1000)) % 60;
        let m = Math.floor((count / 60000));

        document.getElementById('TimeDisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
        if (LowPerformance) {
          setTimeout(stopWatch, 500);
        } else {
          setTimeout(stopWatch, 10);
        }
        setScore();
      } else {
        document.getElementById('timeset').innerHTML = "<small>Time inaccurate? Click here to manually set your time.</small>"
        if (count === 0) {
          document.getElementById('swstart').innerHTML = "Start";
        } else {
          document.getElementById('swstart').innerHTML = `Continue`;
        }
        return
      }
    }

    startB.addEventListener('click', function () {
      if (!timer) {
        if (count === 0) {
          TimerStart = new Date();
        }
        console.log("Started");
        timer = true;
        document.getElementById('swreset').innerHTML = `Reset`;
        document.getElementById('swstop').innerHTML = "Stop"
        stopWatch();
      } else {
        return;
      }
    });
  
    stopB.addEventListener('click', function () {
      if (count === 0) {
        return
      }
      console.log("Timer Stopped");
      timer = false;
      let current = new Date();
      count = +current - +TimerStart;
      let ms = count % 1000;
      let s = Math.floor((count /  1000)) % 60;
      let m = Math.floor((count / 60000)) % 60;
      document.getElementById('TimeDisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
      if (!timer) {
        document.getElementById('swstop').innerHTML = "Retime at<br>this point"
      } else {
        document.getElementById('swstop').innerHTML = "Stop"
      }
      
      setScore()
    });
  
    resetB.addEventListener('click', function () {
        console.log("Timer Reset");
        timer = false;
        count = 0
        document.getElementById('swstop').innerHTML = "Stop"
        document.getElementById('TimeDisplay').innerHTML = "--:--.---";
        document.getElementById('scoredisplay').innerHTML = "-,---,---";
        document.getElementById('swstart').innerHTML = "Start";
        document.getElementById("swstart").style.display="inline"
        document.getElementById('swreset').innerHTML = `<span class="modsubtext">Reset</span>`
        document.getElementById("swstop").style.display="inline"
    });

    timecalib.addEventListener('click', function () {
            let userInput = prompt("Enter time in milliseconds:")
            if (userInput === null) {
              console.log("Input cancelled");
              return;
            }

            let newTime = parseFloat(userInput);
            if (isNaN(newTime) || newTime < 0) {
              alert("Invalid input. Please enter a valid number.");
              return;
            }

            count = newTime
            
            let ms = count % 1000;
            let s = Math.floor((count /  1000)) % 60;
            let m = Math.floor((count / 60000));

            document.getElementById("swstart").style.display="none"
            document.getElementById("swstop").style.display="none"

            document.getElementById('TimeDisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});

            setScore()
        });
    
    lowPerfB.addEventListener('click', function () {
        LowPerformance = !LowPerformance
        if (LowPerformance) {
          document.getElementById('swlow').innerHTML = "Disable Low<br>Performance";
        } else {
          document.getElementById('swlow').innerHTML = "Enable Low<br>Performance";
        }
    });
    
    document.querySelector('.resetbutton').addEventListener('click', resetAllMods);
  }
);
