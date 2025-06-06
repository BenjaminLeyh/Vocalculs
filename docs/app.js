"use strict";
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
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
    "virgule": ".",
};
let resultat;
let transcript;
recognition.onresult = (event) => {
    transcript += `${resultat ? resultat + " " : ""}${event.results[0][0].transcript} `;
    console.log("Vous avez dit :", transcript);
    document.getElementById("output").innerText = `${transcript}`;
};
recognition.onerror = (event) => {
    console.error("Erreur de reconnaissance :", event.error);
};
recognition.onend = () => {
    const res = transcript.split(" ");
    console.log(res);
    const last = res[res.length - 1];
    if (last === "stop") {
        transcript = "";
        resultat = 0;
        return;
    }
    if (last === "=" || last == "égal") {
        res.pop();
        transcript.replace(",", ".");
        const newValue = res.filter((value) => {
            accepted.includes(value);
        }).join(" ");
        console.log("Formaté : ", newValue);
        resultat = eval(newValue);
        document.getElementById("output").innerText = `${transcript} = ${resultat}`;
        console.log("Reconnaissance terminée");
        transcript = "";
    }
    recognition.start();
};
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
