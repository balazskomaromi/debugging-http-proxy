const hoxy = require('hoxy');
const fs = require('fs');
const _ = require('lodash');
const { Command } = require('commander');
const program = new Command();

program
  .option('-p, --port <port>', 'port where the proxy should be registered to', 8081)
  .option('-i, --input <path>', 'path of the file containting debug information', 'responses.json');

program.parse(process.argv);

const data = JSON.parse(fs.readFileSync(program.input));
const responses = data.responses;

const proxy = hoxy.createServer().listen(program.port);

console.log('Proxy started');

proxy.intercept({
    phase: 'response',
    mimeType: 'application/json',
    as: 'json'
}, function (req, resp) {
    const proxyResponseIndex = _.findIndex(responses, item => req.url.endsWith(item.url));

    if (proxyResponseIndex > -1) {
        console.log(`Tampering ${req.url}`);
        const proxied = responses[proxyResponseIndex];

        resp.headers = [];

        _.forEach(proxied.headers, ({ name, value }) => {
            resp.headers[name] = value;
        });

        responses.splice(proxyResponseIndex, 1);
        resp.json = proxied.data;
    }
});
