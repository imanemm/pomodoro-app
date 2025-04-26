const bells = new Audio('audio/happy_bells.wav');
const minutesDiv = document.getElementById('minutes');
const secondsDiv = document.getElementById('seconds');
const startButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break');
const longBreakButton = document.getElementById('long-break');
const pomodoroTime = 25;
const shortBreakTime = 5;
const longBreakTime = 15;

const circle1 = document.getElementById('circle-1');
const circle2 = document.getElementById('circle-2');
const circle3 = document.getElementById('circle-3');
const circle4 = document.getElementById('circle-4');

let myInterval;
let totalSeconds = Number.parseInt(minutesDiv.textContent) * 60;
let isRunning = false;
let state = 'pomodoro';
let nbPomodoro = 0;

const setState = (newState) => {
    state = newState;
    switch (state) {
        case 'pomodoro':
            initialMinutes = pomodoroTime;
            pomodoroButton.classList.add('active');
            shortBreakButton.classList.remove('active');
            longBreakButton.classList.remove('active');
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
            clearInterval(myInterval);
            bells.play();
        }
    }
    , 1000);
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
}

const resetPomodoroState = () => {
    circle1.innerHTML = '<i class="fa-solid fa-circle"></i>';
    circle2.innerHTML = '<i class="fa-solid fa-circle"></i>';
    circle3.innerHTML = '<i class="fa-solid fa-circle"></i>';
    circle4.innerHTML = '<i class="fa-solid fa-circle"></i>';
}

startButton.addEventListener('click', () => {
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