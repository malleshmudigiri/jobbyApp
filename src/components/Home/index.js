import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div>
    <Header />
    <div className="homeDataContainer">
      <h1 className="homeMainHead">Find the Job That Fits Your Life</h1>
      <p className="homeMainPara">Millions of people are searching for jobs</p>
      <Link to="/jobs">
        <button className="findJobsBtn" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
