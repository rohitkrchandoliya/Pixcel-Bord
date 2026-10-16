const grid = document.getElementById('pixelGrid');
const gridContainer = document.getElementById('gridContainer');
const rows = 120;
const cols = 120;
const EXPORT_PIXEL_SIZE = 10;
let currentColor = 'black';
let isDrawing = false;
let zoomScale = 1;

function paintPixel(pixel) {
    if (pixel && pixel.classList.contains('pixel')) {
        pixel.style.backgroundColor = currentColor;
    }
}

function createGrid() {
    grid.replaceChildren();
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < rows * cols; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.addEventListener('pointerdown', event => {
            if (event.button !== 0 && event.pointerType === 'mouse') return;
            isDrawing = true;
            paintPixel(event.currentTarget);
            event.preventDefault();
        });
        pixel.addEventListener('pointerenter', event => {
            if (isDrawing) paintPixel(event.currentTarget);
        });
        pixel.addEventListener('click', event => {
            // A click also supports keyboard and tap activation.
            paintPixel(event.currentTarget);
        });
        fragment.appendChild(pixel);
    }

    grid.appendChild(fragment);
}

function changeColor(color) {
    currentColor = color;
}

function clearGrid() {
    grid.querySelectorAll('.pixel').forEach(pixel => {
        pixel.style.backgroundColor = '#fff';
    });
    isDrawing = false;
}

function downloadImage() {
    const pixels = grid.querySelectorAll('.pixel');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        alert('Could not create an image in this browser.');
        return;
    }

    // Export at 1200x1200 instead of allocating a 4800x4800 canvas.
    canvas.width = cols * EXPORT_PIXEL_SIZE;
    canvas.height = rows * EXPORT_PIXEL_SIZE;

    pixels.forEach((pixel, index) => {
        const x = (index % cols) * EXPORT_PIXEL_SIZE;
        const y = Math.floor(index / cols) * EXPORT_PIXEL_SIZE;
        ctx.fillStyle = pixel.style.backgroundColor || '#fff';
        ctx.fillRect(x, y, EXPORT_PIXEL_SIZE, EXPORT_PIXEL_SIZE);
    });

    try {
        const link = document.createElement('a');
        link.download = 'pixel-art.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        alert('Could not export the pixel art image.');
        console.error(error);
    }
}

gridContainer.addEventListener('wheel', event => {
    event.preventDefault();
    const zoomAmount = 0.1;
    zoomScale += event.deltaY < 0 ? zoomAmount : -zoomAmount;
    zoomScale = Math.min(Math.max(zoomScale, 0.5), 3);
    grid.style.transform = 'scale(' + zoomScale + ')';
}, { passive: false });

window.addEventListener('pointerup', () => {
    isDrawing = false;
});
window.addEventListener('pointercancel', () => {
    isDrawing = false;
});

createGrid();
