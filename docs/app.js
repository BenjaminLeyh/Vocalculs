"use strict";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
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
    "virgule": ".",
};
let resultat;
let transcript;
recognition.onresult = (event) => {
    transcript += `${resultat} ${event.results[0][0].transcript.trim()}`;
    console.log("Vous avez dit :", transcript);
    const calcul = phraseEnCalcul(transcript);
    console.log(calcul);
    document.getElementById("output").innerText = `${transcript}`;
    if (transcript[transcript.length - 1] === "=") {
        resultat = eval(calcul);
        document.getElementById("output").innerText = `${transcript} = ${resultat}`;
    }
    else {
        recognition.start();
    }
};
recognition.onerror = (event) => {
    console.error("Erreur de reconnaissance :", event.error);
};
recognition.onend = () => {
    console.log("Reconnaissance terminée");
};
function phraseEnCalcul(phrase) {
    phrase = phrase.replace("=", "");
    phrase = phrase.replace(",", " ");
    return phrase.trim();
}
function startMic() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
        const statusEl = document.getElementById("status");
        if (statusEl instanceof HTMLElement) {
            statusEl.innerText = "Micro activé 🎙️";
        }
        recognition.start();
        // 🎛️ Optionnel : traitement du flux audio ici (ex: analyseur, enregistrement, etc.)
    })
        .catch((err) => {
        const statusEl = document.getElementById("status");
        if (statusEl instanceof HTMLElement) {
            statusEl.innerText = "Erreur : " + err.message;
        }
    });
}
