const Thin = require('thin');
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

const proxy = new Thin;

console.log(JSON.stringify(data.responses));

proxy.use(function(req, res, next) {

    const proxyResponseIndex = _.findIndex(responses, item => req.url.endsWith(item.url));

    if (proxyResponseIndex > -1) {
        const proxied = responses[proxyResponseIndex];

        _.forEach(proxied.headers, ({name, value}) => {
            res.setHeader(name, value);
        });

        responses.splice(proxyResponseIndex, 1);

        return res.end(proxied.data);
    }

    next();
});

proxy.listen(program.port, 'localhost', function(err) {
});
