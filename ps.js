let activeCount = 0; // Variable to track the number of active (toggled on) divs
let MultScore = 100;
let score = 0
let timer = false

const swIndicator = document.querySelector('.swindicator');

let minute = 0;
let second = 0;
let count = 0;

document.addEventListener('DOMContentLoaded', function () {
    // Stopwatch Buttons
    let startB = document.getElementById('swstart');
    let stopB = document.getElementById('swstop');
    let resetB = document.getElementById('swreset');
    document.querySelector('.modifiermultvalue').textContent = "x1.00";
    const ActiveMods = document.querySelector('.displaymods');
    const placeholder = document.querySelector('.nomods');
    MultScore = 100;
    updateActivatedImages();

    // Function to update the activated Mods inside of the Visualizer
    function updateActivatedImages() {
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
      if (minute * 60 + second < 7200) {
        score = Math.floor((0.0339506175 * ((minute * 60 + second - 7200) ** (2))) * (MultScore/100)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
      } else {
        score = 0
      }
      if (minute === 0 && second === 0) {
        document.getElementById('scoredisplay').innerHTML = "-,---,---";
        return;
      }
      document.getElementById('scoredisplay').innerHTML = score;
    }

    // Function to calculate and update the total score
    function calculateTotalScoreMultiplier() {
      MultScore = 100; // Reset total score
      // Loop over each image-div
      document.querySelectorAll('.modicon').forEach(
        div => {
          const isActive = div.getAttribute('data-active') === 'true'; // Check if active
          const imageScore = parseInt(div.getAttribute('data-score')); // Get the image score
          if (isActive) {
            MultScore += imageScore; // Add score if image is toggled on
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
      console.log(MultScore);
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
      updateActivatedImages();
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
            console.log(`Clicked, was ${isActive}`)
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
          second++;
  
          if (second == 60) {
              minute++;
              second = 0;
          }
  
          let minString = minute;
          let secString = second;
          let countString = count;
  
          if (minute < 10) {
              minString = "0" + minString;
          }
  
          if (second < 10) {
              secString = "0" + secString;
          }
  
          if (count < 10) {
              countString = "0" + countString;
          }
  
          document.getElementById('TimeMins').innerHTML = minString;
          document.getElementById('TimeSecs').innerHTML = secString;
          setTimeout(stopWatch, 1000);
          setScore();
      } else {
        return
      }
    }

    startB.addEventListener('click', function () {
      if (!timer) {
        console.log("Started");
        timer = true;
        swIndicator.style.backgroundColor = 'green'; 
        stopWatch();
      } else {
        return;
      }
    });
  
    stopB.addEventListener('click', function () {
      console.log("Stopped");
      timer = false;
      swIndicator.style.backgroundColor = 'red';
    });
  
    resetB.addEventListener('click', function () {
        console.log("Reset");
        timer = false;
        minute = 0;
        second = 0;
        count = 0;
        document.getElementById('TimeMins').innerHTML = "00";
        document.getElementById('TimeSecs').innerHTML = "00";
        swIndicator.style.backgroundColor = 'gray';
        document.getElementById('scoredisplay').innerHTML = "-,---,---";
    });

    swIndicator.addEventListener('click', function () {
            let userInput = prompt("Enter time in seconds:")
            if (userInput === null) {
              console.log("Input cancelled");
              return;
            }

            let newTime = parseFloat(userInput);
            if (isNaN(newTime)) {
              alert("Invalid input. Please enter a valid number.");
              return;
            }

            minute = Math.floor(newTime/60)
            second = newTime % 60

            let minString = minute;
            let secString = second;
            let countString = count;
    
            if (minute < 10) {
                minString = "0" + minString;
            }
    
            if (second < 10) {
                secString = "0" + secString;
            }
    
            if (count < 10) {
                countString = "0" + countString;
            }
    
            document.getElementById('TimeMins').innerHTML = minString;
            document.getElementById('TimeSecs').innerHTML = secString;

            setScore()
        });
    
    document.querySelector('.resetbutton').addEventListener('click', resetAllMods);
  }
);
