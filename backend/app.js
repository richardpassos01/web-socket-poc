const express = require('express');
const WebSocket = require('ws');

const app = express();

const server = app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`);
});

const wss = new WebSocket.Server({ server });

const backgroundMessage = () => {
    setTimeout(() => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('WEBSOCKET_SUCESS');
            }
        });
    }, 30000);
};

const timeoutEvent = (res) => {
    setTimeout(() => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('WEBSOCKET_TIMEOUT');
            }
        });
    }, 10000); 
};

app.get('/start', (req, res) => {
    timeoutEvent(); 
    res.sendStatus(200);
});


wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
    });
});

backgroundMessage();