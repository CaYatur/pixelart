const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// MongoDB bağlantısı
const username = 'CaYatur'; // Kullanıcı adı
const password = 'CHANGE_ME'; // Şifre
const dbName = 'pixelart'; // Veritabanı adı

mongoose.connect(`YOUR_MONGODB_URI`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Çizim veri şeması ve modeli
const drawingSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    color: String,
});

const Drawing = mongoose.model('Drawing', drawingSchema);

// Statik dosyaları sunma
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));

// "/" yolu için index.html'i göndermek için
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket bağlantısı kurulduğunda
io.on('connection', async (socket) => {
    console.log('Bir istemci bağlandı.');

    // Mevcut çizim verilerini veritabanından alıp istemciye gönder
    const drawings = await Drawing.find();
    socket.emit('drawings', drawings);

    // İstemciden gelen drawPixel mesajını dinle ve çizim yap
    socket.on('drawPixel', async (data) => {
        const { x, y, color } = data;

        // Çizim verisini veritabanına kaydet
        const drawing = new Drawing({ x, y, color });
        await drawing.save();

        // Tüm istemcilere çizim verisini gönder
        io.emit('drawPixel', data);
    });

    // İstemci bağlantısı kesildiğinde
    socket.on('disconnect', () => {
        console.log('Bir istemci ayrıldı.');
    });
});

const PORT = 80;
server.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});