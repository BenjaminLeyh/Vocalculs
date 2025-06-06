const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
const motsVersChiffres: Record<string, string> = {
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
recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
    const transcript = event.results[0][0].transcript;
    console.log("Vous avez dit :", transcript);

    const calcul = phraseEnCalcul(transcript);
    console.log(calcul);
    const resultat = eval(calcul);
    document.getElementById("output")!.innerText = `${transcript} ${resultat}`;
};
recognition.onerror = (event: any) => {
    console.error("Erreur de reconnaissance :", event.error);
};

recognition.onend = () => {
    console.log("Reconnaissance terminée");
};
function phraseEnCalcul(phrase: string): string {
    const mots = phrase.toLowerCase().split(" ");
    let resultat = "";
    let i = 0;

    while (i < mots.length) {
        document.getElementById("output")!.innerText = resultat;

        const mot = mots[i];

        if (mot === "=") {
            break;
        }

        if (mot === ",") {
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
function startMic(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream: MediaStream) => {
            const statusEl = document.getElementById("status");
            if (statusEl instanceof HTMLElement) {
                statusEl.innerText = "Micro activé 🎙️";
            }
            recognition.start();
            // 🎛️ Optionnel : traitement du flux audio ici (ex: analyseur, enregistrement, etc.)
        })
        .catch((err: Error) => {
            const statusEl = document.getElementById("status");
            if (statusEl instanceof HTMLElement) {
                statusEl.innerText = "Erreur : " + err.message;
            }
        });
}