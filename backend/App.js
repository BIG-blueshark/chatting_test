const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let chatting_data = [];

app.get('/test', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ data: chatting_data });
});

app.post('/test', function (req, res) {
    const newData = req.body;
    chatting_data = [newData];
    res.setHeader('Content-Type', 'application/json');
    res.send({ data: chatting_data });
});

var port = 8080;
app.listen(port, function () {
    console.log('\uC11C\uBC84\uAC00 http://localhost:'.concat(port, ' \uC5D0\uC11C \uC2E4\uD589 \uC911\uC785\uB2C8\uB2E4.'));
});
