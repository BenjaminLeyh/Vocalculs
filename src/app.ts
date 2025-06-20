const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = true;
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
let transcript = ""
let result: number = 0;
let stopping = false;
let totalFrom: number;
let totalTo: number;
let tempResult: number = 0;

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
const transcriptElement = document.getElementById("transcript") as HTMLTextAreaElement
const resultElement = document.getElementById("result")
const statusElement = document.getElementById("status");
const totalElement = document.getElementById("total");
const content = document.getElementById("content");
const consoleElement = document.getElementById("console");

startButton?.addEventListener("click", () => {
    start();
});

stopButton?.addEventListener("click", () => {
    stop()
})

transcriptElement?.addEventListener("input", event => {
    if (event.target instanceof HTMLTextAreaElement) {
        transcript = event.target.value;
        try {
            setResult(eval(transcript));
        } catch {
            setTempStatusElement("Erreur dans le calcul");
        }
    }

})


function formatText(text: any) {
    let parts = text.split(" ");
    return parts.map((part : string, pos: number) => {
        if(part === next) {
            clearElements()
        }
        return formatPart(part)
    }).join(" ");
}

recognition.onresult = (event: {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptChunk = event.results[i][0].transcript.toLowerCase();
        if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk;
        } else {
            interimTranscript += transcriptChunk;
        }

    }

    if(finalTranscript) {
        addConsole(finalTranscript);
    }

    try {
        const partsForTotal = finalTranscript ? finalTranscript.split(specialWord) : interimTranscript.split(specialWord);
        const formattedText = formatText(partsForTotal[0]) + " ";
        if(finalTranscript) {
            tempResult = eval(`${result || ""} ${formattedText}`)
            setResult(tempResult)
            setTranscript(transcript + formattedText);
        } else {
            try {
                tempResult = eval(`${result || ""} ${formattedText}`);
                setResultElement(tempResult);
                setTranscriptElement(transcript + formattedText);
            } catch (error) {}
        }

        if (partsForTotal.length > 1) {
            const parts = partsForTotal[1].split(" ").map(formatPart).filter(p => p !== "");
            if(parts.length > 1) {
                totalFrom = Number(parts[0]);
                totalTo = Number(parts[1]);
            }

            if (finalTranscript && !totalFrom || !totalTo || isNaN(totalFrom) || isNaN(totalTo)) {
                setTempStatusElement("Donne le total de départ et le total attendu");
                return;
            }

            setTotalElement(`${Math.round((tempResult / totalFrom * totalTo) * 100) / 100}/${totalTo}`);
        }

    } catch (e) {
        console.error("Erreur lors de l'évaluation de la transcription : ", e);
        setTempStatusElement("Réessaie");
    }
};


recognition.onerror = (event: any) => {
    console.error("Erreur de reconnaissance :", event.error);
};

recognition.onend = () => {
    if (!stopping) {
        recognition.start();
    } else {
        recognition.stop();
    }
};

function start(): void {
    if (content) {
        content.classList.remove("collapsed")
        content.classList.add("collapsable")
    }
    if (stopButton) {
        stopButton.classList.remove("collapsed");
        stopButton.classList.add("collapsable");
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream: MediaStream) => {
            setStatusElement("Transcription en cours ...");
            clearElements()
            recognition.start();
        })
        .catch((err: Error) => {
            console.log(err);
        });
}

function stop(): void {
    if (content) {
        content.classList.add("collapsed")
        content.classList.remove("collapsable")
    }
    if (stopButton) {
        stopButton.classList.add("collapsed");
        stopButton.classList.remove("collapsable");
    }

    clearElements()
    setStatusElement("Appuie sur Calculer pour lancer le calcul")
}

function formatPart(part: string): string {
    part = part.replace(",", ".").replace(" et demi", ".5")
    if(isNaN(Number(part))) {
        return motsVersChiffres[part] ?? "";
    }
    return part;
}

function setResult(newValue: number) {
    result = newValue;
    setResultElement(newValue)
}

function setResultElement(newValue: number) {
    if(resultElement) {
        resultElement.innerText = newValue === 0 ? "" : newValue.toString();
    }
}

function setTranscript(newValue: string) {
    transcript = newValue;
    setTranscriptElement(newValue)
}

function setTranscriptElement(newValue: string) {
    if(transcriptElement) {
        transcriptElement.value = newValue;
    }
}

function setTotalElement(newValue : string) {
    if(totalElement) {
        totalElement.innerText = newValue;
    }
}

function setStatusElement(newValue : string) {
    if(statusElement) {
        statusElement.innerText = newValue;
    }
}

function clearElements() {
    setTranscript("")
    setResult(0)
    setTotalElement("")
}

function setTempStatusElement(newValue : string) {
    setStatusElement(newValue);
    setTimeout(() => {
        setStatusElement("Transcription en cours ...");
    }, 2000)
}

function addConsole(text: string) {
    if(consoleElement) {
        consoleElement.innerText += text;
    }
}