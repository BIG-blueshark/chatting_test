const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const mariadb = require('mariadb');
const { Server } = require('socket.io');
const { createServer } = require('http');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mariadb.createPool({
    host: process.env.Host,
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database,
    connectionLimit: 5,
});

// Test1
// let chatting_data = [];
// app.get('/test', function (req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send({ data: chatting_data });
// });
// app.post('/test', function (req, res) {
//     const newData = req.body;
//     chatting_data = [newData];
//     res.setHeader('Content-Type', 'application/json');
//     res.send({ data: chatting_data });
// });
// app.listen(process.env.Port, function () {
//     console.log('\uC11C\uBC84\uAC00 http://localhost:'.concat(process.env.Port, ' \uC5D0\uC11C \uC2E4\uD589 \uC911\uC785\uB2C8\uB2E4.'));
// });

// Test2
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

let usertemplate = { name: 'testuser', token: '', online: true };
let ms = [];

function conn_io() {
    io.on('connection', async function (socket) {
        console.log('연결됨', socket.id);
        socket.on('login', async function (userName, cb) {
            console.log('유저 입장:', userName);
            // 유저 로그인 시 시스템 메시지
            // const welcomeMessage = {
            //     chat: `${user.name}이 입장`,
            //     user: { id: null, name: 'system' },
            // };
            // io.emit('message', welcomeMessage);
            saveUser = function () {
                let usertest = { name: userName, token: socket.id, online: true };

                if (!usertest.token) {
                    usertest = usertemplate;
                }

                return usertest;
            };
            const user = saveUser();
            cb({ ok: true, data: user });
        });

        socket.on('sendMessage', function (message, cb) {
            // 메시지 저장
            ms.push({ chat: message, id: socket.id });
            // 검증 필요 채팅방사람에게만 보내게
            io.emit('allsend', ms);
            cb({ ok: true });
        });

        socket.on('disconnect', function () {
            console.log('연결 해제', socket.id);
        });
    });
}
conn_io();

httpServer.listen(process.env.Port, function () {
    console.log('\uC11C\uBC84\uAC00 http://localhost:'.concat(process.env.Port, ' \uC5D0\uC11C \uC2E4\uD589 \uC911\uC785\uB2C8\uB2E4.'));
});

// app.get('/test2', async function (req, res) {
//     conn = await pool.getConnection();
//     const result = await conn.query('select * from user');
//     res.send(result);
//     console.log(result);
// });
