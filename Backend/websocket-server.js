const WebsocketServer = require('ws');

const wss = new WebsocketServer.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Установлено новое соединение');

    ws.on('message', function incoming(message) {
        console.log(`Получено сообщение: ${message}`);
    });
    ws.send('Привет, клиент!');
});
