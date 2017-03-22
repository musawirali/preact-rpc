# preact-rpc
React Pre-Rendering via RPC

A simple JSON based socket server that fulfills React component render requests.

[![https://nodei.co/npm/preact-rpc.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/preact-rpc.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/preact-rpc)

Introduction and tutorial: [Server-side React Rendering From non-Node Environments](https://medium.com/@musawiralishah/server-side-react-rendering-from-non-node-environments-216021ad537d#.fzk015qwi)

The motivation for this project is to use React server-side rendering (aka pre-rendering) from a non-Node app, such as one
written in Ruby, or Go.

The preact-rpc server loads a Javascript bundle file containing the React components, and starts listening for render requests
on a socket (a TCP socket or a UNIX socket file). A client, such as a Go app, can connect to the server and send a render request
by providing a React component identifier and the props to use for rendering. The server returns with an HTML string, that can
then be embedded in a view served on the client side.

Install preact-rpc globally:

```
npm install -g preact-rpc
```

In your component JS bundle, register your components so that preact-rpc can find them:

```
import { registerComponent } from 'preact-rpc';
...
registerComponent('comp1', MyComponent);
registerComponent('comp2', MyOtherComponent);
...
```

See lib/example/component.js for example.

Next, start the server. It requires the path to the bundle file and the port to listen on:

```
preact-rpc --bundle=./lib/example/component.js --port=tmp/server.sock
```

An example Go client is provided in the example-clients directory. Run the app and visit http://localhost:8080

```
go run example-clients/client.go
```

An example Ruby client is also provided in the example-clients directory. Install the gem:

```
gem install preact-rpc-client
```

And then run the example:

```
ruby example-clients/client.rb
```

## More to come:
Add support for Redux stores
