let activeCount = 0;
let MultScore = 100;
let score = 0
let timerIsRunning = false
let elapsedTime = 0
let LowPerformance = false
let EndlessIsActive = false
let HeaderHidden = false


let startTime = new Date();
let count = 0
let rooms = 0
let bonus = 0

// Mod Combos
const mc1 = ['2', '3', '4'];
const mc1_1 = ['1', '3', '4'];
const mc2 = ['4', '5'];
const mc3 = ['6', '9'];
const mc4 = ['7', '21'];
const mc5 = ['21', '22'];
const mc6 = ['10', '11'];
const mc7 = ['3', '6'];
const mod_dict = {'1':"SU",'2':"BL",'3':"PF",'4':"CP",'5':"SA",'6':"AN",'7':"HA",'8':"LO",'9':"DF",'21':"TS",'22':"SD",'10':"SN",'11':"PA",'12':"2P",'13':"3P",'14':"4P",'15':"5P",'16':"6P",'17':"7P",'18':"8P+",'19':" I","41":"D1","42":"D2","43":"D3"}
const mod_full = {"SU":"Sensory Underload","BL":"Bargainless","PF":"Perfect","CP":"Cleithrophobia-phobia","SA":"Safety Averse","AN":"Anchored","HA":"Hyperactive","LO":"Lock-On","DF":"Deafened","TS":"Thrillseeker","SD":"Scared of the Dark","SN":"Safety Net","PA":"Premium Assistance","2P":"Friendship-Power","3P":"Friendship-Power","4P":"Group of Sweats","5P":"Group of Sweats","6P":"Group of Sweats","7P":"Group of Sweats","8P+":"This one sucks, doesn't it?"," I":"...what?","D1":"Data-Driven","D2":"Data-Driven","D3":"Data-Driven"}

// Mod ID to File mapping
const idToFilenameMap = {
  1: "res/LightsOut.png",
  2: "res/NothingAllowed.png",
  3: "res/perfect.png",
  4: "res/NoHiding.png",
  5: "res/NoSafety.png",
  6: "res/Flashed.png",
  7: "res/Hyperactive.png",
  8: "res/Target.png",
  9: "res/Silence.png",
  10: "res/SafetyNet.png",
  11: "res/ChillOut.png",
  12: "res/Two",
  13: "res/Three",
  14: "res/Four",
  15: "res/Five",
  16: "res/Six",
  17: "res/Seven",
  18: "res/HighMult.png",
  19: "res/Incomplete.png",
  21: "res/Spot.png",
  22: "res/LightUp.png",
  41: "res/CurrencyT1.png",
  42: "res/CurrencyT2.png",
  43: "res/CurrencyT3.png",
  999: "res/Inf.png"
};

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
    document.querySelector('.switch').classList.remove('active');
    document.querySelector("#stateswitch").checked = false;
    document.querySelectorAll(".subdiv")[1].style.display = "none";
    document.querySelector('#endlessexclusive').style.display = "none";
    const dialog_time = document.getElementById('input-dialog-time');
    const dialog_room = document.getElementById('input-dialog-room');
    const dialog_cancelBtn_t = document.getElementById('cancel-btn-t');
    const dialog_cancelBtn_r = document.getElementById('cancel-btn-r');
    const form_t = document.getElementById('dialog-form-time');
    const form_r = document.getElementById('dialog-form-room');
    document.querySelector('#endlessexclusive').style.display = "none"
    // Stopwatch Buttons
    let startB = document.getElementById('swstart');
    let stopB = document.getElementById('swstop');
    let resetB = document.getElementById('swreset');
    let lowPerfB = document.getElementById('swlow');
    document.querySelector('.modifiermultvalue').textContent = "x1.00";
    const ActiveMods = document.querySelector('.displaymods');
    const placeholder = document.querySelector('.nomods');
    let roomcalib = document.querySelector('#roomset');
    let timecalib = document.querySelector('#timeset');
    let savebutton = document.querySelector('.commit_to_save');
    let deletionbutton = document.querySelector('.SaveSlotDeletion');
    MultScore = 100;
    updateActivatedMods();
    loadSavedData();

    // Function to update the activated Mods inside of the Visualizer
    function updateActivatedMods() {
      // Get all active mods
      const activeMods = document.querySelectorAll('.modicon[data-active="true"]');
      const dataIds = Array.from(activeMods).map(element => element.getAttribute('data-id'));
      const activeModsRelevant = dataIds.filter(item => !["12","13","14","15","16","17","18","19","41","42","43","999"].includes(item));

      // Clear the activated container
      ActiveMods.innerHTML = '';

      // If there are no active images, show the placeholder
      if (activeMods.length === 0) {
        document.getElementById("modcomptext").innerHTML = "No Mod";
        if (!EndlessIsActive) {
          ActiveMods.innerHTML = `<span class="nomods"><img src="res/NoMod.png" class="modiconclone toggled-on"></span>`;
        }
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
      if (EndlessIsActive) {
        EndlessNode = document.querySelectorAll('.modicon')[0].cloneNode()
        EndlessNode.src = "res/Inf.png"
        EndlessNode.setAttribute("data-id", "999")
        EndlessNode.setAttribute("data-active", "true")
        EndlessNode.classList.remove('modicon');
        EndlessNode.classList.add('modiconclone');
        EndlessNode.classList.add('toggled-on');
        if (activeMods.length > 5) {
          EndlessNode.style.margin = "0px 3px 0px 3px"
          if (activeMods.length > 9) {
            EndlessNode.style.margin = "0px 1px 0px 1px"
          }
        }
        ActiveMods.appendChild(EndlessNode)
      }
    }

    // Refreshing the score whenever Mult or Time updates
    function setScore() {
      // "count" = time in ms
      if (EndlessIsActive) {
        if (rooms === 0 || count === 0) {
          document.getElementById('scoredisplay').innerHTML = "-,---,---";
          return;
        }
        // Time (sec) per room
        let speed = (count/1000)/rooms
        if (speed > 16) {
          speed = 16
        }
        if (rooms < 100) {
          speed_score = (15625 * ((speed-20) ** (2))) * rooms/100
        } else {
          speed_score = (15625 * ((speed-20) ** (2)))
        }
        score = Math.floor((speed_score + (rooms*1000)) * (MultScore/100) + bonus).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
      } else {
        if ((count/1000) < 7200) {
          score = Math.floor((0.0339506175 * ((count/1000-7200) ** (2))) * (MultScore/100)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
        } else {
          score = 0
        }
        if (count === 0) {
          document.getElementById('scoredisplay').innerHTML = "-,---,---";
          return;
        }
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
            MultScore += ModScore * MultiplayerAmplifier; // Add score if mod is toggled on
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
      let hasBonus = false;
      const mod3 = document.querySelector('.modicon[data-id="41"]');
      const mod4 = document.querySelector('.modicon[data-id="42"]');
      const mod5 = document.querySelector('.modicon[data-id="43"]');
      if (mod3.getAttribute('data-active') === 'true') {
        bonus = 100000;
        hasBonus = true;
      }
      if (mod4.getAttribute('data-active') === 'true') {
        bonus = 200000;
        hasBonus = true;
      }
      if (mod5.getAttribute('data-active') === 'true') {
        bonus = 300000;
        hasBonus = true;
      }
      if (!hasBonus) {
        bonus = 0
      }
      
      // Update the mult display
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
        document.getElementById('timeset').style.display = "none"
        document.getElementById('swreset').innerHTML = `Stop and<br>Reset`;
        elapsedTime = Date.now() - startTime;
        count = Math.floor(elapsedTime)

        let ms = count % 1000;
        let s = Math.floor((count /  1000)) % 60;
        let m = Math.floor((count / 60000));

        document.getElementById('timedisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
        if (LowPerformance) {
          setTimeout(stopWatchUpdate, 500);
        } else {
          setTimeout(stopWatchUpdate, 10);
        }
        setScore();
      } else {
        document.getElementById('swreset').innerHTML = `Reset`;
        document.getElementById('timeset').style.display = "inline"
        if (count === 0) {
          document.getElementById('swstart').innerHTML = "Start";
        } else {
          document.getElementById('swstart').innerHTML = `Undo Stop`;
        }
        return
      }
    }

    // Loading saved run, if available.
    function loadSavedData() {
        const savedRun = JSON.parse(localStorage.getItem("savedRun"));
        if (savedRun) {
            document.getElementById("scoredisplay_save").innerHTML = savedRun.score.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById("capturedate_save").innerHTML = savedRun.savedate;
            const modContainer = document.getElementById("saved_mods");
            savedRun.dataIds.forEach(id => {
                const imgElement = document.createElement("img");
                imgElement.src = idToFilenameMap[id];
                modContainer.appendChild(imgElement);
            });
          } else {
            document.getElementById("scoredisplay_save").innerHTML = '-,---,---';
            document.getElementById("capturedate_save").innerHTML = '---/--/--';
            document.getElementById("saved_mods").innerHTML = "";
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

      document.getElementById('timedisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
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
        document.getElementById('timedisplay').innerHTML = "--:--.---";
        document.getElementById('scoredisplay').innerHTML = "-,---,---";
        document.getElementById('swstart').innerHTML = "Start";
        document.getElementById("swstart").style.display="inline"
        document.getElementById('swreset').innerHTML = `<span class="modsubtext">Reset</span>`
        document.getElementById("swstop").style.display="inline"
    });

    dialog_cancelBtn_t.addEventListener('click', () => {
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        dialog_time.classList.remove('visible');
        dialog_time.classList.add('hidden');
        setTimeout(() => {
          dialog_time.close();
          
        }, 500); // Match the duration of the transition
    })

    dialog_cancelBtn_r.addEventListener('click', () => {
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        dialog_room.classList.remove('visible');
        dialog_room.classList.add('hidden');
        setTimeout(() => {
          dialog_room.close();
        }, 500); // Match the duration of the transition
    })

    timecalib.addEventListener('click', function () {
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        dialog_time.showModal();
        dialog_time.classList.remove('hidden');
        dialog_time.classList.add('visible');
    });
    
    form_t.addEventListener('submit', (event) => {
      const sfx_button_1 = new Audio("sfx/Button1.wav");
      sfx_button_1.volume = 0.8;
      sfx_button_1.play();
        event.preventDefault(); // Prevent default form submission behavior
        const n1 = parseInt(document.getElementById('number1-t').value, 10);
        const n2 = parseInt(document.getElementById('number2-t').value, 10);
        const n3 = parseInt(document.getElementById('number3-t').value, 10);

        let newTime = n1*60*1000 + n2*1000 + n3
        console.log(newTime)

        if (isNaN(newTime) || newTime < 0) {
            dialog_time.close();
            alert("Invalid input. Please enter a valid number.");
            return;
        }

        // Perform further processing with the numbers
        count = newTime
          
        let ms = count % 1000;
        let s = Math.floor((count /  1000)) % 60;
        let m = Math.floor((count / 60000));

        document.getElementById("swstart").style.display="none";
        document.getElementById("swstop").style.display="none";
        document.getElementById('swreset').innerHTML = `Reset`;

        document.getElementById('timedisplay').innerHTML = m.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "." + ms.toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});

        setScore();

      // Close the dialog after submission
      dialog_time.classList.remove('visible');
      dialog_time.classList.add('hidden');
      setTimeout(() => {
        dialog_time.close();
        
      }, 500); // Match the duration of the transition
    },)

    roomcalib.addEventListener('click', (event) => {
      //if (event.target.tagName == "IMG") {return;};
      const sfx_button_1 = new Audio("sfx/Button1.wav");
      sfx_button_1.volume = 0.8;
      sfx_button_1.play();
      dialog_room.showModal();
      dialog_room.classList.remove('hidden');
      dialog_room.classList.add('visible');
    });
    
    form_r.addEventListener('submit', (event) => {
      const sfx_button_1 = new Audio("sfx/Button1.wav");
      sfx_button_1.volume = 0.8;
      sfx_button_1.play();
      event.preventDefault(); // Prevent default form submission behavior
      const n1 = parseInt(document.getElementById('number1-r').value, 10);

      let newTime = n1

      if (isNaN(newTime) || newTime < 0) {
          dialog_room.close();
          alert("Invalid input. Please enter a valid number.");
          return;
      }

      // Perform further processing with the numbers
      rooms = newTime
      document.getElementById("roomdisplay").innerHTML = rooms;

      setScore();

    // Close the dialog after submission
      dialog_room.classList.remove('visible');
      dialog_room.classList.add('hidden');
      setTimeout(() => {
        dialog_room.close();
        
      }, 500); // Match the duration of the transition
  });

    lowPerfB.addEventListener('click', function () {
        LowPerformance = !LowPerformance;
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        if (LowPerformance) {
          document.body.style.animation = "none";
          document.getElementById('swlow').innerHTML = "Disable Low<br>Performance";
        } else {
          document.body.style.animation = "BGAnimation 60s ease infinite";
          document.getElementById('swlow').innerHTML = "Enable Low<br>Performance";
        }
    });

    savebutton.addEventListener('click', function () {
        const sfx_button_1 = new Audio("sfx/Button1.wav");
        sfx_button_1.volume = 0.8;
        sfx_button_1.play();
        if (count === 0) {
          return
        }
        const savedate = new Date().toLocaleDateString();
        const activeMods = document.querySelectorAll('.modicon[data-active="true"]');
        const dataIds = Array.from(activeMods).map(element => element.getAttribute('data-id'));
        if (EndlessIsActive) {
          dataIds.push(999)
        }
        localStorage.setItem("savedRun", JSON.stringify({score, dataIds, savedate}));
        loadSavedData();
    });

    deletionbutton.addEventListener('click', function () {
        localStorage.removeItem("savedRun");
        loadSavedData()
    });

    document.querySelector('.switchchoice').addEventListener('click', (event) => {
      if (event.target == document.querySelector('.slider')) return;
      EndlessIsActive = !EndlessIsActive
      resetAllMods()
      updateActivatedMods()
      const rootv = document.documentElement;
      RoomNode = document.querySelectorAll(".subdiv")[1]
      document.querySelector('#roomdisplay').innerHTML = "---";
      const sfx_button_1 = new Audio("sfx/Button1.wav");
      sfx_button_1.volume = 0.8;
      sfx_button_1.play();
      // Hiding + Resetting Mods
      // To be hidden
      [3,19].forEach(ModID => {
        let TargetNode = document.querySelector(`.modicon[data-id='`+ModID.toString()+`']`).closest('.tooltip');
        if (!EndlessIsActive) {
          TargetNode.style.display = "inline"
        } else {
          TargetNode.style.display = "none"
        }
      });
      // Background Color + Showing Room# Node
      if (!EndlessIsActive) {
        // REGULAR
        rootv.style.setProperty('--dark_bg', '#000a24');
        rootv.style.setProperty('--bright_bg', '#002652');
        RoomNode.style.display = "none";
        document.querySelector('#modanecdote').innerHTML = "Multiplayer Mods get Bonus-Mult per Harder/Chaos Mod.";
        document.querySelector('#endlessexclusive').style.display = "none"
      } else {
        // ENDLESS
        rootv.style.setProperty('--dark_bg', '#240000');
        rootv.style.setProperty('--bright_bg', '#520000');
        RoomNode.style.display = "initial";
        document.querySelector('#modanecdote').innerHTML = "Multiplayer Mods get Bonus-Mult per Harder/Chaos Mod.<br>Time and Rooms are taken by the first player that dies without reviving.";
        document.querySelector('#endlessexclusive').style.display = "flex"
      }
    });

    document.querySelector('.heading-hidden').addEventListener('click', (event) => {
      if (!HeaderHidden) {
        document.querySelector(".heading").style.height = "0px";
        document.querySelector('.heading-hidden').style.rotation = "180deg";
      } else {
        document.querySelector(".heading").style.height = "180px";
        document.querySelector('.heading-hidden').style.rotation = "0deg";
      }
      HeaderHidden = !HeaderHidden
    });

    document.querySelector('.resetbutton').addEventListener('click', resetAllMods);

    // Select all <img> and <button> elements for hover sfx
    const hoverables = document.querySelectorAll('img, button, label, .editvalue');
    hoverables.forEach(element => {
        element.addEventListener('mouseenter', playHoverSound);
    });
  }
);