const express = require('express');
const WebSocket = require('ws');

const app = express();

const server = app.listen(3001, () => {
    console.log(`Server running at http://localhost:3001`);
});

const wss = new WebSocket.Server({ server });

const db = [];

const backgroundMessage = () => {
    const userId = 1234;

    setTimeout(() => {
        db.push({ userId, success: true });
        console.log('Success message sent');
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log('Is open');
                client.send(`WEBSOCKET_SUCCESS:${userId}`);
            } else {
                console.log('Is close');
            }
        });
    }, 50000);
};

const timeoutEvent = (userId) => {
    if (db.some(entry => entry.userId === userId && entry.success)) {
        console.log('Data already procced');
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log('Is open');
                client.send(`WEBSOCKET_SUCCESS:${userId}`);
            }
        });
    } else {
        console.log('Timeout message sent after 50 seconds');
        setTimeout(() => {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    console.log('Is open');
                    client.send(`WEBSOCKET_TIMEOUT:${userId}`);
                }
            });
        }, 10000);
    }
};

app.get('/start', (req, res) => {
    timeoutEvent(1234);
    res.sendStatus(200);
});

wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
    });
});

backgroundMessage();
