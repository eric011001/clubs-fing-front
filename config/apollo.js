import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from 'node-fetch';
import { setContext } from "apollo-link-context";

const HttpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  //uri: 'https://alamesaback.onrender.com/',
  //uri: 'http://192.168.1.70:4000',
  fetch
});

const authLink = setContext((_,{headers}) => {
  const token = localStorage.getItem('token');
  return{
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(HttpLink)
});

export default client;