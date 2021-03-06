import fetch from 'isomorphic-fetch'
import { useMemo } from 'react'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

export default function useApolloClientConfig(token: string) {
  const httpLink = useMemo(
    () =>
      createHttpLink({
        fetch,
        uri: process.env.GATSBY_API,
      }),
    []
  )

  const authLink = useMemo(
    () =>
      setContext((_, { headers }) => {
        const newHeaders = { ...headers }
        if (token) {
          newHeaders.authorization = `Bearer ${token}`
        }
        return {
          headers: newHeaders,
        }
      }),
    [token]
  )

  const client = useMemo(
    () =>
      new ApolloClient({
        link: ApolloLink.from([
          onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
              graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
              )
            if (networkError) console.log(`[Network error]: ${networkError}`)
          }),
          authLink.concat(httpLink),
        ]),
        cache: new InMemoryCache(),
      }),
    [authLink, httpLink]
  )

  return client
}
