import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useSubscription, useApolloClient } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, ALL_GENRES, ALL_AUTHORS } from './queries'

const updateCacheBook = (cache, query, addBook) => {
  // helper that is used to eliminate saving same person twice
  const updateCache = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: updateCache(allBooks.concat(addBook)),
    }
  })
}

const updateCacheAuthors = (cache, query, addBook) => {
  // helper that is used to eliminate saving same person twice
  const updateCache = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      const k = item.id;
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allAuthors }) => {
    return {
      allAuthors: updateCache(allAuthors.concat(addBook.author)),
    }
  })
}

const updateCacheGenre = (cache, query, addBook) => {
  // helper that is used to eliminate saving same person twice
  const updateCache = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      return seen.has(item) ? false : seen.add(item)
    })
  }

  cache.updateQuery(query, ({ allGenres }) => {
    return {
      allGenres: updateCache(allGenres.concat(addBook.genres)),
    }
  })
}


const App = (props) => {
  const client = useApolloClient() 
  const [ pickGenre, setPickGenre ] = useState(null)
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      NotificationManager.success(`${addedBook.title} added`, 'Create book success', );
      updateCacheBook(client.cache, { query: ALL_BOOKS, variables: {
        genre: pickGenre
      } }, addedBook)
      updateCacheGenre(client.cache, {query: ALL_GENRES}, addedBook)
      updateCacheAuthors(client.cache, { query: ALL_AUTHORS }, addedBook)
    }
  })
  const [page, setPage] = useState('authors')
  const [tokenUser, setTokenUser] = useState(null)

  useEffect(() => {
    const tokenSave = localStorage.getItem(props.keyToken)
    if (tokenSave) {
      setTokenUser(tokenSave)
    }
  }, [props.keyToken]);

  const handleSetTokenUser = (userToken) => {
    setTokenUser(userToken);
    setPage('authors');
    localStorage.setItem(props.keyToken, userToken);
  }

  const handleLogout = () => {
    setTokenUser(null);
    localStorage.removeItem(props.keyToken)
    setPage('authors');
  }

  const switchToPage = (page) => {
    setPage(page);
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {tokenUser === null ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={() => handleLogout()}>logout</button>
          </>
        )}
      </div>

      <Authors tokenUser={tokenUser} show={page === 'authors'} />

      <Books pickGenre={pickGenre} setPickGenre={setPickGenre} tokenUser={tokenUser} show={page === 'books'} />

      <NewBook pickGenre={pickGenre} switchToPage={switchToPage} show={page === 'add'} />

      <Login handleSetTokenUser={handleSetTokenUser} show={page === 'login'} />

      <Recommend show={page === 'recommend'} />
      <NotificationContainer />
    </div>
  )
}

export default App
