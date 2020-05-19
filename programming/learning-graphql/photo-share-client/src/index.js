import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, {InMemoryCache} from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import { persistCache } from 'apollo-cache-persist'

import './index.css';
import App from './App';

const cache = new InMemoryCache()

persistCache({
  cache,
  storage: localStorage
})

if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
  cache.restore(cacheData)
}

const client = new ApolloClient(
  {
    cache,
    uri: process.env.REACT_APP_GRAPHQL_SERVER,
    request: operation => {
      operation.setContext(context => ({
        headers: {
          ...context.headers,
          authorization: localStorage.getItem('token')
        }
      }))
    }
  })

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
