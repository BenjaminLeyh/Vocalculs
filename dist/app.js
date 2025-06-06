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
