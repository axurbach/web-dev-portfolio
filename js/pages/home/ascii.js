const video = document.getElementById("ascii-video");
const canvas = document.getElementById("ascii-canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const asciiOutputs = document.querySelectorAll(".ascii-output");

/*
Darker pixels should use denser characters.
Put the densest characters first, lightest last.
*/
const asciiTokens = ["@@", "$$", "##", "**", "au", "==", "--", "::", ".."];

/*
Because it is square, use the same base dimensions.
But characters are taller than they are wide, so the
canvas height should usually be reduced a bit.
*/
const asciiWidth = 52;
const asciiHeight = 58;
let isRendering = false;
const tokenCellWidth = asciiTokens[0].length;

asciiOutputs.forEach((output) => {
    output.style.width = `${asciiWidth * tokenCellWidth}ch`;
    output.style.height = `${asciiHeight}em`;
    output.style.overflow = "hidden";
});

canvas.width = asciiWidth;
canvas.height = asciiHeight;

function getBrightness(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function brightnessToChar(brightness) {
    const index = Math.floor((brightness / 255) * (asciiTokens.length - 1));
    return asciiTokens[index];
}

function renderAsciiFrame() {
    isRendering = true;

    if (video.paused || video.ended) {
        requestAnimationFrame(renderAsciiFrame);
        return;
    }

    ctx.drawImage(video, 0, 0, asciiWidth, asciiHeight);

    const imageData = ctx.getImageData(0, 0, asciiWidth, asciiHeight);
    const pixels = imageData.data;

    let asciiString = "";

    for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
            const pixelIndex = (y * asciiWidth + x) * 4;

            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];

            const brightness = getBrightness(r, g, b);
            const char = brightnessToChar(brightness);

            asciiString += char;
        }

        if (y < asciiHeight - 1) {
            asciiString += "\n";
        }
    }

    asciiOutputs.forEach((output) => {
        output.textContent = asciiString;
    });

    requestAnimationFrame(renderAsciiFrame);
}

function startAsciiIfReady() {
    if (isRendering) return;
    if (video.readyState >= 2) {
        renderAsciiFrame();
    }
}

video.addEventListener("loadeddata", startAsciiIfReady);
video.addEventListener("canplay", startAsciiIfReady);
video.addEventListener("play", startAsciiIfReady);

if (video.readyState >= 2) {
    startAsciiIfReady();
} else {
    video.load();
}

video.play().catch(() => {
    // Autoplay may still be blocked by browser policies.
});