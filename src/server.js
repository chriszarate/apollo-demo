import React from 'react';
import 'isomorphic-fetch';
import { renderToString } from 'react-dom/server';
import { ApolloClient, createNetworkInterface, getDataFromTree } from 'react-apollo';
import App from './App';

function renderData(res) {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end('{"data":{"member":{ "id":"3", "username":"Dummy", "__typename":"MemberData" }}}');
}

function renderHtml(res) {
  res.writeHead(200, { 'content-type': 'text/html' });

  const apolloClient = new ApolloClient({
    ssrMode: true,
    networkInterface: createNetworkInterface({
      uri: 'http://localhost:3000/graph',
    })
  });

  const tree = <App client={ apolloClient } />;
  getDataFromTree(tree).then(() => {
    const reactMarkup = renderToString(tree);
    const initialState = {
      apollo: {
        data: apolloClient.store.getState().apollo.data
      }
    };

    res.end(`
      <!doctype html>
      <html>
        <body>
          <div id="mount">${ reactMarkup }</div>
          <script>
            window.__APOLLO_STATE__ = ${JSON.stringify(initialState)}
          </script>
          <script src="./dist/bundle.js"></script>
        </body>
      </html>
    `);
  })
}

function renderJs(res) {
  require('fs').readFile('./dist/bundle.js', (err, data) => {
    if (err) {
      throw err;
    }
    res.end(data);
  })
}

require('http').createServer((req, res) => {
  switch(req.url) {
    case '/graph':
      renderData(res);
      return;
    case '/dist/bundle.js':
      renderJs(res);
      return;
    default:
      renderHtml(res);
  }
}).listen(3000, () => console.log('LISTENING ON 3000'));
