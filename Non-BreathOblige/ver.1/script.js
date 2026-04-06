window.appState = {
  transcript: "",
  isRecording: false,
  lastUpdatedAt: Date.now()
};

let recognition = null;
let timerInterval = null;
let startTime = null;

const transcriptBox = document.getElementById("transcriptBox");
const statusText = document.getElementById("statusText");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");
const langSelect = document.getElementById("langSelect");

function updateTranscript(text) {
  window.appState.transcript = text;
  window.appState.lastUpdatedAt = Date.now();
  transcriptBox.textContent = text.trim() || "Your speech will appear here...";
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  startTime = Date.now();
  timerEl.textContent = "00:00";

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerEl.textContent = formatTime(Date.now() - startTime);
  }, 250);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function setUIRecordingState(isRecording) {
  window.appState.isRecording = isRecording;
  startBtn.disabled = isRecording;
  stopBtn.disabled = !isRecording;
  langSelect.disabled = isRecording;
  statusText.textContent = isRecording ? "Listening..." : "Stopped";

  if (isRecording) {
    startTimer();
  } else {
    stopTimer();
  }
}

function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    statusText.textContent = "Speech recognition not supported in this browser";
    startBtn.disabled = true;
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = langSelect.value;
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let finalTranscript = "";
    let interimTranscript = "";

    for (let i = 0; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += piece + " ";
      } else {
        interimTranscript += piece;
      }
    }

    updateTranscript((finalTranscript + interimTranscript).trim());
  };

  recognition.onerror = (event) => {
    statusText.textContent = `Error: ${event.error}`;
  };

  recognition.onend = () => {
    if (window.appState.isRecording) {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Recognition restart skipped:", err);
      }
    }
  };
}

function startRecording() {
  if (!recognition) return;

  recognition.lang = langSelect.value;
  updateTranscript("");
  setUIRecordingState(true);

  try {
    recognition.start();
  } catch (err) {
    console.warn("Recognition already running:", err);
  }
}

function stopRecording() {
  if (!recognition) return;

  setUIRecordingState(false);

  try {
    recognition.stop();
  } catch (err) {
    console.warn("Recognition stop failed:", err);
  }
}

startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);

clearBtn.addEventListener("click", () => {
  updateTranscript("");
  statusText.textContent = window.appState.isRecording ? "Listening..." : "Idle";
  timerEl.textContent = "00:00";

  if (!window.appState.isRecording) {
    stopTimer();
  }
});

langSelect.addEventListener("change", () => {
  if (!window.appState.isRecording) {
    statusText.textContent = `Language: ${langSelect.options[langSelect.selectedIndex].text}`;
  }
});

initRecognition();

const enterBtn = document.getElementById("enterBtn");

if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    window.location.href = "garden.html";
  });
}