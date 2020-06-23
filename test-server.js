var express = require('express');
var app = express();

app.use(express.urlencoded({ limit: '10mb' }));

app.get('/testjson', function (req, res) {
    console.log(req.protocol, 'get req.query', req.query);
    res.json({
        name: "original",
    });
});

app.post('/testjson', function (req, res) {
    console.log(req.protocol, 'post req.query', req.query);
    console.log(req.protocol, 'post req.body', req.body);
    res.end('{}');
});

app.all('/teststring', function (req, res) {
    res.send('original');
});

app.listen(3001, function (err) {
    if (err) {
        console.log('http server', err);
    }
});
