debugging-http-proxy
=========

is a HTTP/HTTPS debugging proxy which can take an input file with predefined request-responses. When traffic goes through the proxy which has a match in the debug file, it can intercept and overwrite response going to the client.


### Installation

```bash
yarn install
```


### Usage

#### Test server:

Start dev server by running:
```
node test-server.js
```

#### Proxy:

```
node app.js
```

Send a request through the proxy and notice that the intercepted result is returned:

```shell
curl -x http://localhost:8081 http://localhost:3001/foobar
```

Response should be `something different` instead of `original`.