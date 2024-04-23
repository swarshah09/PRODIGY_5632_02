let timer;
let isRunning = false;
let isPaused = false;
let startTime;
let pausedTime = 0;
let laps = [];

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStop');
const pauseResumeBtn = document.getElementById('pauseResume');
const lapBtn = document.getElementById('lap');
const resetBtn = document.getElementById('reset');
const lapsList = document.getElementById('laps');
const clickSound = new Audio('./audio_sound_trim.mp3');


function playClickSound() {
    clickSound.currentTime = 0; // Reset the sound to the beginning in case it's already playing
    clickSound.play();
}

function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    return (
        (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (seconds < 10 ? '0' : '') + seconds + ':' +
        (milliseconds < 10 ? '00' : (milliseconds < 100 ? '0' : '')) + milliseconds
    );
}

function updateTime() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime + pausedTime;
    display.textContent = formatTime(elapsedTime);
}

function startStop() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startStopBtn.textContent = 'Start';
        pauseResumeBtn.textContent = 'Pause';
        lapBtn.disabled = true;
        pauseResumeBtn.classList.add('hidden');
        isPaused = false;
    } else {
        if (isPaused) {
            pausedTime += new Date().getTime() - pauseTime;
        } else {
            startTime = new Date().getTime();
            pausedTime = 0;
            laps = [];
            lapsList.innerHTML = '';
        }
        timer = setInterval(updateTime, 10);
        isRunning = true;
        startStopBtn.textContent = 'Stop';
        lapBtn.disabled = false;
        pauseResumeBtn.classList.remove('hidden');
    }
    playClickSound();
}

function pauseResume() {
    if (isPaused) {
        pauseTime = new Date().getTime();
        pauseResumeBtn.textContent = 'Pause';
        isPaused = false;
    } else {
        pauseResumeBtn.textContent = 'Resume';
        isPaused = true;
    }
    playClickSound();
}

function lap() {
    if (isRunning && !isPaused) {
        const lapTime = new Date().getTime() - startTime + pausedTime;
        laps.push(lapTime);
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${laps.length}: ${formatTime(lapTime)}`;
        lapsList.appendChild(lapItem);
    }
    playClickSound();
}

function reset() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    display.textContent = '00:00:00:000';
    startStopBtn.textContent = 'Start';
    pauseResumeBtn.textContent = 'Pause';
    lapBtn.disabled = true;
    pauseResumeBtn.classList.add('hidden');
    laps = [];
    lapsList.innerHTML = '';
    playClickSound();
}

startStopBtn.addEventListener('click', startStop);
pauseResumeBtn.addEventListener('click', pauseResume);
lapBtn.addEventListener('click', lap);
resetBtn.addEventListener('click', reset);