const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.continuous = true;
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

const startButton = document.getElementById("start")
const stopButton = document.getElementById("stop")
const transcriptElement = document.getElementById("transcript")
const resultElement = document.getElementById("result")
const statusElement = document.getElementById("status");
const totalElement = document.getElementById("total");


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

recognition.onresult = (event: {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}) => {
    try {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const res = event.results[i][0];
            const transcriptPart = res.transcript.trim();

            if (event.results[i].isFinal) {
                finalTranscript += transcriptPart + " ";
            } else {
                // Optionnel : tu peux afficher le transcript en direct ici
                // transcriptElement!.innerText = transcript + transcriptPart;
            }
        }

        if (finalTranscript.trim()) {
            const specialOppParts = finalTranscript.split(specialWord);

            let formattedText = formatText(specialOppParts[0]) + " ";
            setResult(eval(`${result === 0 ? "" : result} ${formattedText}`));
            setTranscript(transcript + formattedText);

            if (specialOppParts.length > 1) {
                const parts = specialOppParts[1].split(" ").map(formatPart).filter(p => p !== "");
                const from = Number(parts[0]);
                const to = Number(parts[1]);
                if (!isNaN(from) && !isNaN(to)) {
                    setTotal(`Total sur ${to} : ${(result / from * to).toString()}`);
                }
            }
        }
    } catch (e) {
        console.error("Erreur lors de l'évaluation de la transcription : ", e);
    }
};

recognition.onerror = (event: any) => {
    console.error("Erreur de reconnaissance :", event.error);
};

recognition.onend = () => {
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
            if (!statusElement || !transcriptElement || !resultElement) {
                return;
            }
            statusElement.innerText = "Transcription en cours ...";
            clearElements()
            recognition.start();
        })
        .catch((err: Error) => {
            console.log(err);
        });
}

function stopMic(): void {
    stopping = true;
    if(statusElement) {
        statusElement.innerText = "";
    }
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

function clearElements() {
    setResult(0)
    setTranscript("")
    setTotal("")
}