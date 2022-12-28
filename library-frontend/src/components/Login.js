import { useMutation } from '@apollo/client'
import { LOGIN, ME_AUTH } from '../queries'

const Login = (props) => {
  const [ loginAction ] = useMutation(LOGIN, {
    refetchQueries: [ { query: ME_AUTH } ]
  })

  if (!props.show) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;
    loginAction({variables: {username, password}}).then((response) => {
        if (response.data.login && response.data.login.value) {
            props.handleSetTokenUser(response.data.login.value)
        } else {}
      })
    event.target[0].value = '';
    event.target[1].value = '';
  }
  
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                name <input name="username" />
            </div>
            <div>
                password <input name="password" />
            </div>
            <button>login</button>
        </form>
    </div>
  )
}

export default Login
