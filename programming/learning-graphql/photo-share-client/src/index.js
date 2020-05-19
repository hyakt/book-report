import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'

const client = new ApolloClient(
  {
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
