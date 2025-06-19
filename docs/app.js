"use strict";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
const specialWord = "total";
const next = "suivant";
const motsVersChiffres = {
    "zéro": "0",
    "un": "1",
    "deux": "2",
    "trois": "3",
    "quatre": "4",
    "cinq": "5",
    "six": "6",
    "sept": "7",
    "huit": "8",
    "neuf": "9",
    "plus": "+",
    "moins": "-",
    "fois": "*",
    "multiplié": "*",
    "divisé": "/",
    "diviser": "/",
    "virgule": ".",
    ",": ".",
    "+": "+",
    "-": "-",
    "/": "/",
    "*": "*",
    "x": "*"
};
let result = 0;
let transcript = "";
let stopping = false;
let totalFrom;
let totalTo;
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const transcriptElement = document.getElementById("transcript");
const resultElement = document.getElementById("result");
const statusElement = document.getElementById("status");
const totalElement = document.getElementById("total");
const consoleElement = document.getElementById("console");
startButton === null || startButton === void 0 ? void 0 : startButton.addEventListener("click", () => {
    startMic();
});
stopButton === null || stopButton === void 0 ? void 0 : stopButton.addEventListener("click", () => {
    stopMic();
});
function formatText(text) {
    console.log("before formatting : ", text);
    let parts = text.split(" ");
    return parts.map((part, pos) => {
        if (part === next) {
            clearElements();
        }
        return formatPart(part);
    }).join(" ");
}
recognition.onresult = (event) => {
    try {
        let newTranscript = event.results[0][0].transcript.toLowerCase();
        const partsForTotal = newTranscript.split(specialWord);
        let formattedText = formatText(partsForTotal[0]) + " ";
        setResult(eval(`${result || ""} ${formattedText}`));
        setTranscript(transcript + formattedText);
        if (partsForTotal.length > 1) {
            if (partsForTotal[1].length > 0) {
                const parts = partsForTotal[1].split(" ").map((part) => { return formatPart(part); }).filter((part) => part !== "");
                totalFrom = Number(parts[0]);
                totalTo = Number(parts[1]);
            }
            if (!totalFrom || !totalTo || isNaN(totalFrom) || isNaN(totalTo)) {
                setStatus("Veuillez donner le total de départ et le total attendu");
                return;
            }
            setTotal(`${Math.round((result / totalFrom * totalTo) * 100) / 100}/${totalTo}`);
        }
    }
    catch (e) {
        console.error("Erreur lors de l'évaluation de la transcription : ", e);
        setStatus("Veuilez réessayer");
    }
};
recognition.onerror = (event) => {
    console.error("Erreur de reconnaissance :", event.error);
};
recognition.onend = () => {
    if (!stopping) {
        recognition.start();
    }
    else {
        recognition.stop();
    }
};
function startMic() {
    console.log("Starting Mic...");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
        setStatus("Transcription en cours ...");
        clearElements();
        recognition.start();
    })
        .catch((err) => {
        console.log(err);
    });
}
function stopMic() {
    stopping = true;
    setStatus("Appuyer sur Calculum pour lancer le calcul");
}
function formatPart(part) {
    var _a;
    part = part.replace(",", ".");
    if (isNaN(Number(part))) {
        return (_a = motsVersChiffres[part]) !== null && _a !== void 0 ? _a : "";
    }
    return part;
}
function setResult(newValue) {
    result = newValue;
    if (resultElement) {
        resultElement.innerText = newValue == 0 ? "" : newValue.toString();
    }
}
function setTranscript(newValue) {
    transcript = newValue;
    if (transcriptElement) {
        transcriptElement.innerText = newValue;
    }
}
function setTotal(newValue) {
    if (totalElement) {
        totalElement.innerText = newValue;
    }
}
function setStatus(newValue) {
    if (statusElement) {
        statusElement.innerText = newValue;
    }
}
function clearElements() {
    setResult(0);
    setTranscript("");
    setTotal("");
}
