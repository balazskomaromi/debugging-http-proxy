const hoxy = require('hoxy');
const fs = require('fs');
const _ = require('lodash');
const { Command } = require('commander');
const program = new Command();

function overwrites(value) {
    return value.split(',');
  }

program
  .option('-p, --port <port>', 'port where the proxy should be registered to', 8081)
  .option('-i, --input <path>', 'path of the file containting debug information', 'example.json')
  .option('-o, --overrides <items>', 'comma separated list of host overrides', overwrites);

program.parse(process.argv);

let data = fs.readFileSync(program.input, "utf8");

if (program.overrides) {
    _.forEach(program.overrides, (override) => {
        const pair = override.split('-');

        data = data.replace(pair[0], pair[1]);
    });
}

const parsed = JSON.parse(data);
const responses = parsed.responses;

const proxy = hoxy.createServer().listen(program.port);

console.log('Proxy started');

proxy.intercept({
    phase: 'request'
}, function (req, resp) {
    const proxyResponseIndex = _.findIndex(responses, item => {
        return req.fullUrl().startsWith(item.url) && req.method === item.method.toUpperCase();
    });

    if (proxyResponseIndex > -1) {
        console.log(`Tampering ${req.method} request on ${req.fullUrl()}`);
        const proxied = responses[proxyResponseIndex];

        resp.headers = [];

        _.forEach(proxied.headers, ({ name, value }) => {
            resp.headers[name] = value;
        });

        const mimeType = _.find(proxied.headers, ({name}) => name == 'content-type');

        if (mimeType && mimeType.value.includes('application/json') && typeof proxied.data === 'string') {
            resp.json = JSON.parse(proxied.data);
        } else {
            resp.json = proxied.data;
        }

        responses.splice(proxyResponseIndex, 1);
        resp.statusCode = proxied.statusCode;
    } else {
        console.log(`Could not find predefined request for ${req.method} request on ${req.fullUrl()}`);
    }
});
