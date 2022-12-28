import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    born,
    bookCount,
    id
  }
}
`

export const ALL_BOOKS = gql`
query($genre: String) {
  allBooks (genre: $genre) {
    title,
    published,
    genres,
    author {
      name
    },
    id
  }
}
`

export const ME_AUTH = gql `
query {
  me {
    username,
    favouriteGenre
  }
}
`

export const CREATE_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String]!) {
addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    title
    published
    author {
      name,
      born,
      bookCount,
      id
    }
    id
    genres
  }
}`

export const UPDATE_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    id
    born
    bookCount
  }
}`


export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
login(
  username: $username,
  password: $password
  ) {
    value
  }
}`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        name,
        born,
        bookCount,
        id
      }
      id
      genres
    }
  }
`

export const ALL_GENRES = gql`
query {
  allGenres
}
`