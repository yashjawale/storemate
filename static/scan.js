function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult)
    document.getElementById("barcode").value = decodedText
}

function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`)
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", {
        fps: 10,
        qrbox: {
            width: 250,
            height: 250
        }
    },
    /* verbose= */
    false);

const reader = document.getElementById("reader")
const qrButton = document.getElementById("qr-button")

qrButton.addEventListener("click", (e) => {
    e.preventDefault()
    if (reader.classList.contains("d-none")) {
        reader.classList.remove("d-none")
        html5QrcodeScanner.render(onScanSuccess, onScanFailure)
    } else {
        reader.classList.add("d-none")
        html5QrcodeScanner.clear()
    }
})
