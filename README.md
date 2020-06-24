debugging-http-proxy
=========

is a HTTP/HTTPS debugging proxy which can take an input file with predefined request-responses. When traffic goes through the proxy which has a match in the debug file, it can intercept and overwrite response going to the client.

debugging-http-proxy is created around [hoxy](http://greim.github.io/hoxy/)

### Installing dependencies

```bash
yarn install
```


### Usage

#### Test server:

Start sample dev server by running:
```
node test-server.js
```

Server will listen on port 3001.

#### Proxy:

```
node app.js
```

Send a request through the proxy and notice that the intercepted result is returned:

```shell
curl -x http://localhost:8081 http://localhost:3001/testjson
```

Response should contain `something different` instead of `original`. When executing the command again, `original` should appear, as requests in the debug file only applied once.

### Proxy parameters:

| Parameter | Description | Default |
| --------- | ----------- | ----------- |
| -p, --port <port>  | Specify a port for the proxy  | 8081 |
| -i, --input <path> | Path for the input fle containing debug information | example.json |
| '-o, --overrides <items>' | Define overrides for values in the debug file | - |

### Overrides:

'-o, --overrides <items>' parameter can be used to define overrides for values in the debug file. This can be useful when the original debug file contains a set of hosts, but you would like to use something different.
Multiple overrides can be given spearated by comma, and a colon between the values.

Example:
-o `http://replacethis.com;http://withthis.com,http://andalsothis.com;http://withsomethingdifferent.com`

### Using with docker:

There is a Dockerfile in the project, making it possible to integrate the proxy into a docker environment. In order to make this work, you have to route traffic towards the proxy image. By default, it listens on `8081`.

Example:

```
proxy:
    build:
      context: https://github.com/balazskomaromi/debugging-http-proxy
    environment:
      VIRTUAL_HOST: <your-network>.docker
    ports:
      - 8081:8081
    entrypoint: node app.js
```

### Additional information:
* See `example.json` for how the debug file should look like
* HTTPS is not supported at the moment. Internally, [hoxy](http://greim.github.io/hoxy/) is used, which supports HTTPS, so it could be integrated
