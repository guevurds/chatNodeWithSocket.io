const express = require('express')
const app = express();
const http = require('http').createServer(app);
const sockets = require('socket.io')(http);

let numberConnections = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// app.use(express.static('public'))

http.listen(process.env.PORT || 3000, () => {
    console.log('ta aberto a porcaria do baguio na porta 3000');
    console.log(" "+ new Date);
})

let historicoMensagem = [];

sockets.on ("connection", socket => {
    const playerId = socket.id;
    console.log("connected: " + playerId);
    numberConnections.push(playerId);

    atualizaClients();
    estadoChat();
    console.log(numberConnections.length);

    socket.on ("disconnect", () => {
        console.log("disconnect: " + playerId);
        numberConnections.splice(numberConnections.indexOf(playerId), 1);

        atualizaClients();
        console.log(numberConnections.length);
    })

    socket.on ('newMessage', mensagem => {
        updateChat(mensagem);
        historicoMensagem.push(mensagem);
        console.log(historicoMensagem)
    })
})

function atualizaClients() {
    sockets.emit('qlogados', numberConnections);
}

function updateChat(mensagem) {
    sockets.emit('atualizaChat', mensagem);
}

function estadoChat() {
    console.log('enviando estado')
    sockets.emit('estadoDoChat', historicoMensagem);
}

