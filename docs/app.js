"use strict";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
const specialWord = "total";
const next = "suivant";
const accepted = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "*", "-", "/", "."];
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
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const transcriptElement = document.getElementById("transcript");
const resultElement = document.getElementById("result");
const statusElement = document.getElementById("status");
const totalElement = document.getElementById("total");
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
        let newTranscript = event.results[0][0].transcript;
        const specialOppParts = newTranscript.split(specialWord);
        let formattedText = formatText(specialOppParts[0]) + " ";
        setResult(eval(transcript + formattedText));
        setTranscript(transcript + formattedText);
        if (specialOppParts.length > 1) {
            const parts = specialOppParts[1].split(" ").map((part) => { return formatPart(part); }).filter((part) => part !== "");
            console.log(parts);
            const from = parts[0];
            const to = parts[1];
            setTotal(`Total sur ${to} : ${(result / from * to).toString()}`);
        }
    }
    catch (e) {
        console.error("Erreur lors de l'évaluation de la transcription");
    }
};
recognition.onerror = (event) => {
    console.error("Erreur de reconnaissance :", event.error);
};
recognition.onend = () => {
    if (!stopping) {
        recognition.start();
    }
};
function startMic() {
    console.log("Starting Mic...");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
        if (!statusElement || !transcriptElement || !resultElement) {
            return;
        }
        statusElement.innerText = "Transcription en cours ...";
        clearElements();
        recognition.start();
    })
        .catch((err) => {
        console.log(err);
    });
}
function stopMic() {
    stopping = true;
    if (statusElement) {
        statusElement.innerText = "";
    }
}
function formatPart(part) {
    var _a;
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
function clearElements() {
    setResult(0);
    setTranscript("");
    setTotal("");
}
