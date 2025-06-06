"use strict";
function startMic() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
        const statusEl = document.getElementById("status");
        if (statusEl instanceof HTMLElement) {
            statusEl.innerText = "Micro activé 🎙️";
        }
        // 🎛️ Optionnel : traitement du flux audio ici (ex: analyseur, enregistrement, etc.)
    })
        .catch((err) => {
        const statusEl = document.getElementById("status");
        if (statusEl instanceof HTMLElement) {
            statusEl.innerText = "Erreur : " + err.message;
        }
    });
}
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
function phraseEnCalcul(phrase) {
    const mots = phrase.toLowerCase().split(" ");
    let resultat = "";
    let i = 0;
    while (i < mots.length) {
        const mot = mots[i];
        if (mot === "égal") {
            break;
        }
        if (mot === "virgule") {
            // Récupérer la partie avant et concaténer avec les suivants
            resultat = resultat.trimEnd(); // enlever l’espace avant
            resultat += ".";
            // Ajouter les chiffres suivants
            i++;
            while (i < mots.length && motsVersChiffres[mots[i]]) {
                resultat += motsVersChiffres[mots[i]];
                i++;
            }
            resultat += " ";
            continue;
        }
        const conversion = motsVersChiffres[mot];
        if (conversion) {
            resultat += conversion + " ";
        }
        i++;
    }
    return resultat.trim();
}
