import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = (props) => {
  const [pickAuthor, setPickAuthor] = useState({})
  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  

  if (!props.show) {
    return null
  }
  
  if (loading) {
    return <div>loading...</div>
  }
  
  if (error) {
    return <div>error...</div>
  }

  const handleSubmitAuthor = (e) => {
    e.preventDefault();
    if (pickAuthor) {
      updateAuthor({variables: {
        name: pickAuthor.name,
        setBornTo: Number(e.target[1].value)
      }}).then((response) => {
        if (response.data.editAuthor) {
          setPickAuthor(data.allAuthors[0])
          e.target[1].value = '';
        } else {}
      })
    }
  }

  const handleChange = (event) => {
    const authorTarget = data.allAuthors.find(f => f.name === event.target.value);
    setPickAuthor(authorTarget);
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.tokenUser ? (
        <>
          <h2>set birthday</h2>
          <form onSubmit={handleSubmitAuthor}>
            <div>
              <label>
                Pick author:
                <select value={pickAuthor.name} onChange={handleChange}>
                  <option value="">Pick author</option>
                  {data.allAuthors.map((a) => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              born <input />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      ) : null}
    </div>
  )
}

export default Authors
