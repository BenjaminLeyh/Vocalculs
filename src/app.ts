function startMic(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream: MediaStream) => {
            const statusEl = document.getElementById("status");
            if (statusEl instanceof HTMLElement) {
                statusEl.innerText = "Micro activé 🎙️";
            }

            // 🎛️ Optionnel : traitement du flux audio ici (ex: analyseur, enregistrement, etc.)
        })
        .catch((err: Error) => {
            const statusEl = document.getElementById("status");
            if (statusEl instanceof HTMLElement) {
                statusEl.innerText = "Erreur : " + err.message;
            }
        });
}