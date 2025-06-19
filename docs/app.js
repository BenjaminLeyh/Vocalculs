"use strict";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = true;
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
let transcript = "";
let result = 0;
let stopping = false;
let totalFrom;
let totalTo;
let tempResult = 0;
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const transcriptElement = document.getElementById("transcript");
const resultElement = document.getElementById("result");
const statusElement = document.getElementById("status");
const totalElement = document.getElementById("total");
const title = document.querySelector("h1");
const content = document.getElementById("content");
const controls = document.getElementById("controls");
startButton === null || startButton === void 0 ? void 0 : startButton.addEventListener("click", () => {
    start();
});
stopButton === null || stopButton === void 0 ? void 0 : stopButton.addEventListener("click", () => {
    stop();
});
transcriptElement === null || transcriptElement === void 0 ? void 0 : transcriptElement.addEventListener("input", event => {
    if (event.target instanceof HTMLTextAreaElement) {
        transcript = event.target.value;
        console.log(event.target.value);
        try {
            setResult(eval(transcript));
        }
        catch {
            setTempStatusElement("Erreur dans le calcul");
        }
    }
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
    let interimTranscript = "";
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptChunk = event.results[i][0].transcript.toLowerCase();
        if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk;
        }
        else {
            interimTranscript += transcriptChunk;
        }
    }
    try {
        const partsForTotal = finalTranscript ? finalTranscript.split(specialWord) : interimTranscript.split(specialWord);
        const formattedText = formatText(partsForTotal[0]) + " ";
        if (finalTranscript) {
            tempResult = eval(`${result || ""} ${formattedText}`);
            setResult(tempResult);
            setTranscript(transcript + formattedText);
        }
        else {
            try {
                tempResult = eval(`${result || ""} ${formattedText}`);
                setResultElement(tempResult);
                setTranscriptElement(transcript + formattedText);
            }
            catch (error) { }
        }
        if (partsForTotal.length > 1) {
            const parts = partsForTotal[1].split(" ").map(formatPart).filter(p => p !== "");
            if (parts.length > 1) {
                totalFrom = Number(parts[0]);
                totalTo = Number(parts[1]);
            }
            if (finalTranscript && !totalFrom || !totalTo || isNaN(totalFrom) || isNaN(totalTo)) {
                setTempStatusElement("Donne le total de départ et le total attendu");
                return;
            }
            setTotalElement(`${Math.round((tempResult / totalFrom * totalTo) * 100) / 100}/${totalTo}`);
        }
    }
    catch (e) {
        console.error("Erreur lors de l'évaluation de la transcription : ", e);
        setTempStatusElement("Réessaie");
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
function start() {
    if (content)
        content.classList.remove("collapsed");
    if (stopButton)
        stopButton.classList.remove("collapsed");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
        setStatusElement("Transcription en cours ...");
        clearElements();
        recognition.start();
    })
        .catch((err) => {
        console.log(err);
    });
}
function stop() {
    if (stopButton)
        stopButton.classList.add("collapsed");
    if (content)
        content.classList.add("collapsed");
    clearElements();
    setStatusElement("Appuie sur Calculer pour lancer le calcul");
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
    setResultElement(newValue);
}
function setResultElement(newValue) {
    if (resultElement) {
        resultElement.innerText = newValue === 0 ? "" : newValue.toString();
    }
}
function setTranscript(newValue) {
    transcript = newValue;
    setTranscriptElement(newValue);
}
function setTranscriptElement(newValue) {
    if (transcriptElement) {
        transcriptElement.value = newValue;
    }
}
function setTotalElement(newValue) {
    if (totalElement) {
        totalElement.innerText = newValue;
    }
}
function setStatusElement(newValue) {
    if (statusElement) {
        statusElement.innerText = newValue;
    }
}
function clearElements() {
    setTranscript("");
    setResult(0);
    setTotalElement("");
}
function setTempStatusElement(newValue) {
    setStatusElement(newValue);
    setTimeout(() => {
        setStatusElement("Transcription en cours ...");
    }, 2000);
}
