var express = require('express');
var app = express();

app.use(express.urlencoded({ limit: '10mb' }));

app.get('/test', function (req, res) {
    console.log(req.protocol, 'get req.query', req.query);
    res.end('get: hello world');
});

app.post('/test', function (req, res) {
    console.log(req.protocol, 'post req.query', req.query);
    console.log(req.protocol, 'post req.body', req.body);
    res.end('post: hello world');
});

app.all('/foobar', function (req, res) {
    res.send('original');
});

app.listen(3001, function (err) {
    if (err) {
        console.log('http server', err);
    }
});
