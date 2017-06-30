import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import App from './App';

const apolloClient = new ApolloClient({
  initialState: window.__APOLLO_STATE__,
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3000/graph',
  })
});

ReactDOM.render(
  <App client={ apolloClient } />,
  document.querySelector('#mount')
);