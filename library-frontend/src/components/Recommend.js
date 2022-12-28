import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME_AUTH } from '../queries'

const Recommend = (props) => {
  const resBooks = useQuery(ALL_BOOKS)
  const resMeAuth = useQuery(ME_AUTH)
  
  if (!props.show) {
    return null
  }

  if (resBooks.loading || resMeAuth.loading) {
    return <div>loading...</div>
  }

  if (resBooks.error || resMeAuth.error) {
    return <div>error...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{resMeAuth.data.me.favouriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {resBooks.data.allBooks.filter(f => f.genres.includes(resMeAuth.data.me.favouriteGenre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
