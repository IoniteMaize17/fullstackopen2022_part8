import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'

const Books = (props) => {
  const resultBooks = useQuery(ALL_BOOKS, {
    variables: {
      genre: props.pickGenre
    }
  })
  const resultGenres = useQuery(ALL_GENRES)
  
  if (!props.show) {
    return null
  }

  if (resultBooks.loading || resultGenres.loading) {
    return <div>loading...</div>
  }

  if (resultBooks.error || resultGenres.error) {
    return <div>error...</div>
  }

  const handleSetGenrePick = (genre) => {
    props.setPickGenre(genre);
  }

  return (
    <div>
      <h2>books</h2>
      {props.pickGenre ? (
        <p>in genre <b>{props.pickGenre}</b></p>
      ) : null}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {resultBooks.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {resultGenres.data.allGenres.map((genre) => (
          <button key={genre} onClick={() => handleSetGenrePick(genre)}>{genre}</button>
        ))}
      </div>
    </div>
  )
}

export default Books
