import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache,
  split
} from '@apollo/client'
import App from './App';
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

import 'react-notifications/lib/notifications.css';

const KEY_SAVE_USER_TOKEN = 'lib_user_saved';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(KEY_SAVE_USER_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/ws',
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

// Supported in React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App keyToken={KEY_SAVE_USER_TOKEN} />
  </ApolloProvider>
);