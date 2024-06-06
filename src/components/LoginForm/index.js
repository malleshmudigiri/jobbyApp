import {Component} from 'react'

import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  onSuccessFull = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onChageUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onFormSubmission = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      this.onSuccessFull(data.jwt_token)
    } else {
      const data = await response.json()
      this.setState({errorMsg: data.error_msg})
      this.onFailure()
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    return (
      <div className="loginContainer">
        <div className="loginFormContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="websiteLogo"
          />

          <form onSubmit={this.onFormSubmission} className="formContainer">
            <div className="inputElContainer">
              <label htmlFor="username" className="labelEl">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                onChange={this.onChageUsername}
                value={username}
                className="inputEl"
                placeholder="Username"
              />
            </div>
            <div className="inputElContainer">
              <label htmlFor="password" className="labelEl">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                onChange={this.onChangePassword}
                value={password}
                className="inputEl"
                placeholder="Password"
              />
            </div>
            <button type="submit" className="loginBtn">
              Login
            </button>
            {errorMsg !== '' && <p className="errorMessage">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
