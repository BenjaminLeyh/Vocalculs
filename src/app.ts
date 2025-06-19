const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
const specialWord = "total"
const next = "suivant"
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
    "diviser": "/",
    "virgule": ".",
    ",": ".",
    "+": "+",
    "-": "-",
    "/": "/",
    "*": "*",
    "x": "*"
};
let result: number = 0;
let transcript: string = "";
let stopping = false;
let totalFrom: number;
let totalTo: number;

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
const transcriptElement = document.getElementById("transcript")
const resultElement = document.getElementById("result")
const statusElement = document.getElementById("status");
const totalElement = document.getElementById("total");
const consoleElement = document.getElementById("console");

startButton?.addEventListener("click", () => {
    startMic()
})

stopButton?.addEventListener("click", () => {
    stopMic()
})

function formatText(text: any) {
    console.log("before formatting : ",text)
    let parts = text.split(" ");
    return parts.map((part : string, pos: number) => {
        if(part === next) {
            clearElements()
        }
        return formatPart(part)
    }).join(" ");
}

recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
    if(consoleElement) consoleElement.innerText += `${event.results[0][0].transcript} \n`
    try {
        let newTranscript = event.results[0][0].transcript

        const partsForTotal = newTranscript.split(specialWord);
        console.log("special", partsForTotal)

        let formattedText = formatText(partsForTotal[0]) + " ";
        setResult(eval(`${result || ""} ${formattedText}`));
        setTranscript(transcript + formattedText);
        if(partsForTotal.length > 1) {
            if(partsForTotal[1].length > 0) {
                const parts = partsForTotal[1].split(" ").map((part: string) => { return formatPart(part) }).filter((part: string) => part !== "");
                totalFrom = Number(parts[0]);
                totalTo = Number(parts[1]);
            }
            if(!totalFrom || !totalTo || !isNaN(totalFrom) || !isNaN(totalTo)) {
                setStatus("Veuillez donner le total de départ et le total attendu")
                return;
            }
            setTotal(`${Math.round((result / totalFrom * totalTo) * 100) / 100}/${totalTo}`);
        }

        recognition.start()
    } catch (e) {
        console.error("Erreur lors de l'évaluation de la transcription : ", e);
        setStatus("Veuilez réessayer")
    }
};

recognition.onerror = (event: any) => {
    console.error("Erreur de reconnaissance :", event.error);
};

recognition.onend = () => {
    if(consoleElement) consoleElement.innerText += "onEnd called\n"

    if (!stopping) {
        setTimeout(() => {
            recognition.start();
        }, 200);
    } else {
        recognition.stop();
    }
};

function startMic(): void {
    console.log("Starting Mic...");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream: MediaStream) => {
            setStatus("Transcription en cours ...");
            clearElements()
            recognition.start();
        })
        .catch((err: Error) => {
            console.log(err);
        });
}

function stopMic(): void {
    stopping = true;
    setStatus("Appuyer sur Calculum pour lancer le calcul")
}

function formatPart(part: string): string {
    part = part.replace(",", ".")
    if(isNaN(Number(part))) {
        return motsVersChiffres[part] ?? "";
    }
    return part;
}

function setResult(newValue: number) {
    result = newValue;
    if(resultElement) {
        resultElement.innerText = newValue == 0 ? "" : newValue.toString();
    }
}

function setTranscript(newValue: string) {
    transcript = newValue;
    if(transcriptElement) {
        transcriptElement.innerText = newValue;
    }
}

function setTotal(newValue : string) {
    if(totalElement) {
        totalElement.innerText = newValue;
    }
}

function setStatus(newValue : string) {
    if(statusElement) {
        statusElement.innerText = newValue;
    }
}

function clearElements() {
    setResult(0)
    setTranscript("")
    setTotal("")
}