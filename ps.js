let activeCount = 0; // Variable to track the number of active (toggled on) divs
let MultScore = 100;
let score = 0
let timerIsRunning = false
let elapsedTime = 0
let LowPerformance = false


let startTime = new Date();
let count = 0

// Mod Combos
const mc1 = ['2', '3', '4'];
const mc1_1 = ['1', '3', '4'];
const mc2 = ['4', '5'];
const mc3 = ['6', '9'];
const mc4 = ['7', '21'];
const mc5 = ['21', '22'];
const mc6 = ['10', '11'];
const mc7 = ['3', '6'];
const mod_dict = {'1':"SU",'2':"BL",'3':"PF",'4':"CP",'5':"SA",'6':"AN",'7':"HA",'8':"LO",'9':"DF",'21':"TS",'22':"SD",'10':"SN",'11':"PA",'12':"2P",'13':"3P",'14':"4P",'15':"5P",'16':"6P",'17':"7P",'18':"8P+",'19':" I"}
const mod_full = {"SU":"Sensory Underload","BL":"Bargainless","PF":"Perfect","CP":"Cleithrophobia-phobia","SA":"Safety Averse","AN":"Anchored","HA":"Hyperactive","LO":"Lock-On","DF":"Deafened","TS":"Thrillseeker","SD":"Scared of the Dark","SN":"Safety Net","PA":"Premium Assistance","2P":"Friendship-Power","3P":"Friendship-Power","4P":"Group of Sweats","5P":"Group of Sweats","6P":"Group of Sweats","7P":"Group of Sweats","8P+":"This one sucks, doesn't it?"," I":"...what?",}

// SFX
const sfx_hover = new Audio('sfx/Hover.wav');
const sfx_button_1 = new Audio('sfx/Button1.wav');
const sfx_button_2 = new Audio('sfx/Button2.wav');
const sfx_select = new Audio('sfx/SelectMod.wav');
const sfx_deselect = new Audio('sfx/DeselectMod.wav');
sfx_hover.preload = "auto";
sfx_button_1.preload = "auto";
sfx_button_2.preload = "auto";
sfx_select.preload = "auto";
sfx_deselect.preload = "auto";

function playHoverSound() {
  const sfx_hover = new Audio("sfx/Hover.wav");
  sfx_hover.volume = 0.8
  sfx_hover.play();
}

function ArrComp(a,b) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

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
      const activeMods = document.querySelectorAll('.modicon[data-active="true"]');
      const dataIds = Array.from(activeMods).map(element => element.getAttribute('data-id'));
      const activeModsRelevant = dataIds.filter(item => !["12","13","14","15","16","17","18","19"].includes(item));

      // Clear the activated container
      ActiveMods.innerHTML = '';

      // If there are no active images, show the placeholder
      if (activeMods.length === 0) {
        placeholder.style.display = 'block';
        ActiveMods.appendChild(placeholder);
        document.getElementById("modcomptext").innerHTML = "No Mod";
      } else {
        if (activeMods.length === 1) {
          document.getElementById("modcomptext").innerHTML = mod_full[mod_dict[activeMods[0].getAttribute('data-id')]];
        }
        placeholder.style.display = 'none';
        // Loop through all active images and display them above
        let modcomptext = ""
        activeMods.forEach(activeImageDiv => {
          if (activeMods.length != 1) {
            modcomptext = modcomptext + mod_dict[activeImageDiv.getAttribute('data-id')]
            document.getElementById("modcomptext").innerHTML = modcomptext
            if (ArrComp(activeModsRelevant,mc1)) {
              document.getElementById("modcomptext").innerHTML = "Badge Triumvirate+"
            }
            if (ArrComp(activeModsRelevant,mc1_1)) {
              document.getElementById("modcomptext").innerHTML = "Badge Triumvirate"
            }
            if (ArrComp(activeModsRelevant,mc2)) {
              document.getElementById("modcomptext").innerHTML = "Leaving it to Fate"
            }
            if (ArrComp(activeModsRelevant,mc3)) {
              document.getElementById("modcomptext").innerHTML = "Neural Annihilation"
            }
            if (ArrComp(activeModsRelevant,mc4)) {
              document.getElementById("modcomptext").innerHTML = "No time for carefulness"
            }
            if (ArrComp(activeModsRelevant,mc5)) {
              document.getElementById("modcomptext").innerHTML = "Like a moth to the flame"
            }
            if (ArrComp(activeModsRelevant,mc6)) {
              document.getElementById("modcomptext").innerHTML = "Chilling out"
            }
            if (ArrComp(activeModsRelevant,mc7)) {
              document.getElementById("modcomptext").innerHTML = "Expert Cameraman"
            }
          }
          const clonedImg = activeImageDiv.cloneNode(true);
          clonedImg.classList.add('activated-image');
          clonedImg.classList.remove('modicon');
          clonedImg.classList.add('modiconclone');
          if (activeMods.length > 5) {
            clonedImg.style.margin = "0px 3px 0px 3px"
            if (activeMods.length > 9) {
              clonedImg.style.margin = "0px 1px 0px 1px"
            }
          }
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
      let RelevantModsList = ["1","2","3","4","5","6","7","8","9","21","22"]
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

    // Function to toggle off all active mods
    function resetAllMods() {
      sfx_button_2.currentTime = 0
      sfx_button_2.volume = 0.8
      sfx_button_2.play()
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

    // Set up event listeners for the mods
    document.querySelectorAll('.modicon').forEach(
      div => {
        div.addEventListener('click', function () {
            const isActive = this.getAttribute('data-active') === 'true';
            if (isActive) {
              const sfx_select = new Audio("sfx/DeselectMod.wav");
              sfx_select.volume = 0.8;
              sfx_select.play();
              this.classList.remove('toggled-on'); // Remove toggled-on class
              this.setAttribute('data-active', 'false'); // Set as inactive
            } else {
              const sfx_deselect = new Audio("sfx/SelectMod.wav");
              sfx_deselect.volume = 0.8;
              sfx_deselect.play();
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
    function stopWatchUpdate() {
      if (timerIsRunning) {
        document.getElementById('timeset').innerHTML = ""
        document.getElementById('swreset').innerHTML = `Stop and Reset`;
        elapsedTime = Date.now() - startTime;
        count = Math.floor(elapsedTime)

        let ms = count % 1000;
        let s = Math.floor((count /  1000)) % 60;
        let m = Math.floor((count / 60000));

        document.getElementById('TimeDisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
        if (LowPerformance) {
          setTimeout(stopWatchUpdate, 500);
        } else {
          setTimeout(stopWatchUpdate, 10);
        }
        setScore();
      } else {
        document.getElementById('swreset').innerHTML = `Reset`;
        document.getElementById('timeset').innerHTML = "<small>Time inaccurate? Click here to manually set your time.</small>"
        if (count === 0) {
          document.getElementById('swstart').innerHTML = "Start";
        } else {
          document.getElementById('swstart').innerHTML = `Undo Stop`;
        }
        return
      }
    }

    startB.addEventListener('click', function () {
      if (!timerIsRunning) {
        if (count === 0) {
          startTime = Date.now() - elapsedTime;
        }
        console.log("Started");
        document.getElementById('swstart').innerHTML = `<span class="modsubtext">Start</span>`;
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        timerIsRunning = true;
        document.getElementById('swreset').innerHTML = `Reset`;
        document.getElementById('swstop').innerHTML = "Stop"
        stopWatchUpdate();
      } else {
        return;
      }
    });
  
    stopB.addEventListener('click', function () {
      if (count === 0) {
        return
      }
      console.log("Timer Stopped");
      const sfx_button_1 = new Audio("sfx/Button1.wav");
      sfx_button_1.volume = 0.8;
      sfx_button_1.play();
      timerIsRunning = false;
      elapsedTime = Date.now() - startTime;
      count = Math.floor(elapsedTime)
      
      let ms = count % 1000;
      let s = Math.floor((count /  1000)) % 60;
      let m = Math.floor((count / 60000));

      document.getElementById('TimeDisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
      document.getElementById('swstop').innerHTML = "Retime at<br>this point"
      
      setScore()
    });
  
    resetB.addEventListener('click', function () {
        console.log("Timer Reset");
        timerIsRunning = false;
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        count = 0
        elapsedTime = 0
        document.getElementById('swstop').innerHTML = `<span class="modsubtext">Stop</span>`
        document.getElementById('TimeDisplay').innerHTML = "--:--.---";
        document.getElementById('scoredisplay').innerHTML = "-,---,---";
        document.getElementById('swstart').innerHTML = "Start";
        document.getElementById("swstart").style.display="inline"
        document.getElementById('swreset').innerHTML = `<span class="modsubtext">Reset</span>`
        document.getElementById("swstop").style.display="inline"
    });

    timecalib.addEventListener('click', function () {
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
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
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        if (LowPerformance) {
          document.getElementById('swlow').innerHTML = "Disable Low<br>Performance";
        } else {
          document.getElementById('swlow').innerHTML = "Enable Low<br>Performance";
        }
    });
    
    document.querySelector('.resetbutton').addEventListener('click', resetAllMods);

    // Select all <img> and <button> elements for hover sfx
    const hoverables = document.querySelectorAll('img, button');
    hoverables.forEach(element => {
        element.addEventListener('mouseenter', playHoverSound);
    });
  }
);
