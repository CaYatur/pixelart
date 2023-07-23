const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const pixelSize = 10; // Her bir pixelin boyutu
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'black', 'white', 'cyan', 'magenta', 'lime', 'olive', 'teal', 'navy', 'maroon', 'silver', 'limegreen', 'darkslateblue', 'salmon', 'slategray', 'darkkhaki']; // 24 renk seçeneği
let counter = 1; // Kullanıcının piksel hakkı
let intervalId; // Geri sayım için setInterval() fonksiyonunun dönüş değeri

// Canvas'a tıklanan noktayı pixel'e dönüştürmek için işlev
function getPixel(x, y) {
    return {
        x: Math.floor(x / pixelSize),
        y: Math.floor(y / pixelSize)
    };
}

// Pixel boyutunda kare çizmek için işlev
function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Mouse'un canvas üzerine tıklanması
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const pixel = getPixel(mouseX, mouseY);
    const x = pixel.x;
    const y = pixel.y;

    const selectedColor = document.querySelector('.selected'); // Seçilen rengi al

    if (selectedColor && counter > 0) {
        const color = selectedColor.style.backgroundColor;
        drawPixel(x, y, color); // Seçilen rengi kullanarak piksel çiz

        // Çizimi diğer istemcilere göndermek için WebSocket kullanımı
        const data = { x, y, color };
        socket.emit('drawPixel', data);

        // Kullanıcının piksel hakkını azalt
        counter -= 1;
        updateCounterUI();

        // Sayaç geri sayımını başlat
        startCounter();
    }
});

// Renk kutularına tıklanması
const colorBoxes = document.querySelectorAll('.color');
colorBoxes.forEach((box) => {
    box.addEventListener('click', (e) => {
        const selectedBox = document.querySelector('.selected');
        if (selectedBox) {
            selectedBox.classList.remove('selected');
        }
        box.classList.add('selected');
    });
});

// Piksel hakkını güncellemek için UI'yı günceller
function updateCounterUI() {
    const counterElement = document.getElementById('pixelCounter');
    counterElement.textContent = counter;
}

// Her 30 saniyede bir kullanıcının piksel hakkını yükselt
function increaseCounter() {
    counter += 1;
    updateCounterUI();
}

// Sayaç geri sayımı için fonksiyon
function startCounter() {
    clearInterval(intervalId); // Daha önce başlatılmış bir sayaç varsa sıfırlayın
    let seconds = 30;

    const counterElement = document.getElementById('counter');

    intervalId = setInterval(() => {
        seconds -= 1;
        counterElement.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(intervalId);
            counterElement.textContent = "30";
            increaseCounter();
        }
    }, 1000);
}

// WebSocket bağlantısı kurulduğunda
const socket = io();


socket.on('connect', () => {
    console.log('Sunucuya bağlanıldı.');

    // Sunucudan alınan çizim verilerini çiz
    socket.on('drawings', (drawings) => {
        drawings.forEach(({ x, y, color }) => {
            drawPixel(x, y, color);
        });
    });

    // Sunucudan gelen çizim verilerini çiz
    socket.on('drawPixel', ({ x, y, color }) => {
        drawPixel(x, y, color);
    });

    // Sunucudan kullanıcının piksel hakkını al
    socket.on('updateCounter', (newCounter) => {
        counter = newCounter;
        updateCounterUI(); // Burada sayaç güncellemesini de çağırmalıyız
    });
});