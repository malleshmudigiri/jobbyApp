import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <ul className="headerContainer">
      <Link to="/">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="websiteLogo"
          />
        </li>
      </Link>

      <li className="menuTabs">
        <Link to="/" className="menuItem">
          <p>Home</p>
        </Link>
        <Link to="/jobs" className="menuItem">
          <p>Jobs</p>
        </Link>
      </li>
      <li>
        <button className="logoutBtn" onClick={onClickLogout} type="button">
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
