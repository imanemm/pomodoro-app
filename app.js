const bells = new Audio('audio/happy_bells.wav');
bells.load();

const minutesDiv = document.getElementById('minutes');
const secondsDiv = document.getElementById('seconds');

const startButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break');
const longBreakButton = document.getElementById('long-break');
const skipButton = document.getElementById('skip');
const saveButton = document.getElementById('save-settings');


const circle1 = document.getElementById('circle-1');
const circle2 = document.getElementById('circle-2');
const circle3 = document.getElementById('circle-3');
const circle4 = document.getElementById('circle-4');

let pomodoroTime = 25;
let shortBreakTime = 5;
let longBreakTime =  15;

let myInterval;
let totalSeconds = Number.parseInt(minutesDiv.textContent) * 60;
let isRunning = false;
let state = 'pomodoro';
let nbPomodoro = 0;

const defaultBackground = 'url("ghibli-bg/painting.jpg")';
document.body.style.backgroundImage = defaultBackground;

const timeSettings = () => {
    const pomodoroInput = document.getElementById('pomodoro-length').value;
    const shortBreakInput = document.getElementById('short-break-length').value;
    const longBreakInput = document.getElementById('long-break-length').value;

    pomodoroTime = Number.parseInt(pomodoroInput);
    shortBreakTime = Number.parseInt(shortBreakInput);
    longBreakTime = Number.parseInt(longBreakInput);

    if (isNaN(pomodoroTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
        alert('Please enter valid numbers for the time settings.');
        return false; // Indicate failure
    }
    if (pomodoroTime < 1 || shortBreakTime < 1 || longBreakTime < 1) {
        alert('Please enter positive numbers for the time settings.');
        return false; // Indicate failure
    }

    return true; // Indicate success
};


const setState = (newState) => {
    state = newState;
    switch (state) {
        case 'pomodoro':
            initialMinutes = pomodoroTime;
            pomodoroButton.classList.add('active');
            shortBreakButton.classList.remove('active');
            longBreakButton.classList.remove('active');
            resetPomodoroState();
            break;
        case 'short-break':
            initialMinutes = shortBreakTime;
            pomodoroButton.classList.remove('active');
            shortBreakButton.classList.add('active');
            longBreakButton.classList.remove('active');
            break;
        case 'long-break':
            initialMinutes = longBreakTime;
            pomodoroButton.classList.remove('active');
            shortBreakButton.classList.remove('active');
            longBreakButton.classList.add('active');
            circle4.innerHTML = '<i class="fa-solid fa-circle"></i>';
            break;
    }
    resetTimer();
}

const toggleStateButtons = (disable) => {
    pomodoroButton.disabled = disable;
    shortBreakButton.disabled = disable;
    longBreakButton.disabled = disable;
};

const resetTimer = () => {
    clearInterval(myInterval);
    totalSeconds = initialMinutes * 60;
    updateTimerDisplay();
    startButton.textContent = 'Start';
    isRunning = false;
}

const updateTimerDisplay = () => {
    const minutesLeft = Math.floor(totalSeconds / 60);
    const secondsLeft = totalSeconds % 60;

    minutesDiv.textContent = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
    secondsDiv.textContent = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
}

const startTimer = () => {
    myInterval = setInterval(() => {
        totalSeconds--;
        updateTimerDisplay();

        if (totalSeconds <= 0) {
            console.log('Playing bell sound');
            bells.play().catch((error) => {
                console.error('Audio playback permission denied', error);
            });

            clearInterval(myInterval);

            if (state === 'pomodoro') {
                nbPomodoro++;
                pomodoroState();
                if (nbPomodoro % 4 === 0) {
                    setState('long-break');
                    resetPomodoroState();
                } else {
                    setState('short-break');
                }
            } else {
                setState('pomodoro');
            }
            startTimer();
        }
    }
    , 1000);
};

const skipToNextState = () => {
    clearInterval(myInterval);
    if (state === 'pomodoro') {
        nbPomodoro++;
        pomodoroState();
        if (nbPomodoro % 4 === 0) {
            setState('long-break');
        } else {
            setState('short-break');
        }
    } else {
        setState('pomodoro');
    }

};

const pomodoroState = () => {
    if (nbPomodoro % 4 === 1) {
        circle1.innerHTML = '<i class="fa-solid fa-circle"></i>';
    } else if (nbPomodoro % 4 === 2) {
        circle2.innerHTML = '<i class="fa-solid fa-circle"></i>';
    } else if (nbPomodoro % 4 === 3) {
        circle3.innerHTML = '<i class="fa-solid fa-circle"></i>';
    } else if (nbPomodoro % 4 === 0) {
        circle4.innerHTML = '<i class="fa-solid fa-circle"></i>';
    }
};

const resetPomodoroState = () => {
    circle1.innerHTML = '<i class="fa-regular fa-circle"></i>';
    circle2.innerHTML = '<i class="fa-regular fa-circle"></i>';
    circle3.innerHTML = '<i class="fa-regular fa-circle"></i>';
    circle4.innerHTML = '<i class="fa-regular fa-circle"></i>';
};

startButton.addEventListener('click', () => {
    if (!isRunning) {
        bells.play().catch((error) => {
            console.error('Audio playback permission denied', error);
        });
        bells.pause();
        bells.currentTime = 0;
    }
    if (isRunning) {
        clearInterval(myInterval);
        startButton.textContent = 'Start';
        toggleStateButtons(false);
    }
    else {
        startTimer();
        startButton.textContent = 'Pause';
        toggleStateButtons(true);
    }
    isRunning = !isRunning;
});

resetButton.addEventListener('click', () => {
    resetTimer();
});

pomodoroButton.addEventListener('click', () => setState('pomodoro'));
shortBreakButton.addEventListener('click', () => setState('short-break'));
longBreakButton.addEventListener('click', () => setState('long-break'));
skipButton.addEventListener('click', () => {
    skipToNextState();
    startButton.textContent = 'Start';
    isRunning = false;
    toggleStateButtons(false);
});

const settingsButton = document.getElementById('settings');

saveButton.addEventListener('click', () => {
    if (!timeSettings()) {
        return; 
    }

    // Update the timer with the new settings
    if (state === 'pomodoro') {
        initialMinutes = pomodoroTime;
    } else if (state === 'short-break') {
        initialMinutes = shortBreakTime;
    } else if (state === 'long-break') {
        initialMinutes = longBreakTime;
    }

    totalSeconds = initialMinutes * 60;
    updateTimerDisplay();

    // Close the sidebar after saving settings
    const sidebar = document.getElementById('setting-sidebar');
    sidebar.classList.remove('show');
    settingsButton.style.backgroundColor = 'transparent';
    settingsButton.style.color = '#fff';
});

function toggleSidebar() {
    const sidebar = document.getElementById('setting-sidebar');

    const sidebarisOpen = sidebar.classList.toggle('show');

    if (sidebarisOpen) {
        settingsButton.style.backgroundColor = '#fff';
        settingsButton.style.color = '#000';
    } else {
        settingsButton.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        settingsButton.style.color = '#fff';
    }
}

settingsButton.addEventListener('click', toggleSidebar);

const backgroundImageSelector = () => {
    const backgroundElement = document.body;

    let selectedImage = document.querySelector('select[name="bg-image"]').value;
    switch (selectedImage) {
        case 'country-home':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/country-home.jpg")';
            break;
        case 'flying-home':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/flying-home.jpg")';
            break;
        case 'forest':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/forest.jpg")';
            break;
        case 'moon':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/moon.jpg")';
            break;
        case 'painting':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/painting.jpg")';
            break;
        case 'sea':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/sea.jpg")';
            break;
        case 'traditional-home':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/traditional-home.jpg")';
            break;
        case 'train':
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/train.jpg")';
            break;
        default:
            backgroundElement.style.backgroundImage = 'url("ghibli-bg/painting.jpg")';
            break;
    }
};

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('select[name="bg-image"]').addEventListener('change', backgroundImageSelector);
});
