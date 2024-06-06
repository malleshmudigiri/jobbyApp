import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {IoBagAddSharp} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
}

class Jobs extends Component {
  state = {
    jobs: [],
    profileData: {},
    typeOfEmployement: [],
    salaryRange: [],
    searchInput: '',
    employmentTypes: employmentTypesList.map(each => ({
      ...each,
      isClicked: false,
    })),
    salaryRanges: salaryRangesList.map(each => ({...each, isClicked: false})),
    profileApiStatus: apiConstants.initial,
    jobsApiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.onRenderProfile()
    this.onRenderJobsList()
  }

  onRenderProfile = async () => {
    this.setState({profileApiStatus: apiConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileApiStatus: apiConstants.success,
        profileData: updatedData,
      })
    } else {
      this.setState({profileApiStatus: apiConstants.failure})
    }
  }

  onRenderJobsList = async () => {
    this.setState({jobsApiStatus: apiConstants.inProgress})
    const {typeOfEmployement, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${typeOfEmployement.join(
      ',',
    )}&minimum_package=${salaryRange.join(',')}&search=${searchInput}`
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.setState({jobsApiStatus: apiConstants.success})
    } else {
      this.setState({jobsApiStatus: apiConstants.failure})
    }

    const jobsCamelCaseList = data.jobs.map(eachJobItem => ({
      companyLogoUrl: eachJobItem.company_logo_url || '',
      employmentType: eachJobItem.employment_type || '',
      id: eachJobItem.id,
      jobDescription: eachJobItem.job_description || '',
      location: eachJobItem.location || '',
      packagePerAnnum: eachJobItem.package_per_annum || '',
      rating: eachJobItem.rating || '',
      title: eachJobItem.title || '',
    }))

    this.setState({jobs: jobsCamelCaseList})
  }

  onChageEmployee = event => {
    const checkedValue = event.target.value
    const {employmentTypes} = this.state
    const checkedEmployeList = employmentTypes.map(eachMovie => {
      if (eachMovie.employmentTypeId === checkedValue) {
        return {...eachMovie, isClicked: !eachMovie.isClicked}
      }
      return eachMovie
    })

    checkedEmployeList.forEach(eachMovie => {
      if (eachMovie.employmentTypeId === checkedValue) {
        if (eachMovie.isClicked) {
          this.setState(
            prev => ({
              typeOfEmployement: [...prev.typeOfEmployement, checkedValue],
            }),
            this.onRenderJobsList,
          )
        } else {
          this.setState(
            prev => ({
              typeOfEmployement: prev.typeOfEmployement.slice(0, -1),
            }),
            this.onRenderJobsList,
          )
        }
      }
    })
    this.setState({employmentTypes: checkedEmployeList})
  }

  onChaneSalaryRange = event => {
    const changeSalaryChexBox = event.target.value
    const {salaryRanges} = this.state
    const checkedSalarylist = salaryRanges.map(eachSalary => {
      if (eachSalary.salaryRangeId === changeSalaryChexBox) {
        return {...eachSalary, isClicked: !eachSalary.isClicked}
      }
      return eachSalary
    })

    checkedSalarylist.map(eachSalary => {
      if (eachSalary.salaryRangeId === changeSalaryChexBox) {
        if (eachSalary.isClicked) {
          this.setState(
            prev => ({
              salaryRange: [...prev.salaryRange, changeSalaryChexBox],
            }),
            this.onRenderJobsList,
          )
        } else {
          this.setState(
            prev => ({
              salaryRange: prev.salaryRange.slice(0, -1),
            }),
            this.onRenderJobsList,
          )
        }
      }
      return eachSalary
    })
    this.setState({salaryRanges: checkedSalarylist})
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.onRenderJobsList()
  }

  onSuccessfulProfileView = () => {
    const {profileData} = this.state
    const {name, shortBio, profileImageUrl} = profileData

    return (
      <div className="profileContainer">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="personName">{name}</h1>
        <p className="personBio">{shortBio}</p>
      </div>
    )
  }

  onRetryProfile = () => {
    this.onRenderProfile()
  }

  onFailureProfileView = () => (
    <button type="button" className="retryBtn" onClick={this.onRetryProfile}>
      Retry
    </button>
  )

  onProfilrInProgress = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryJobs = () => {
    this.onRenderJobsList()
  }

  onSuccesJobsView = () => {
    const {jobs} = this.state

    if (jobs.length > 0) {
      return (
        <ul>
          {jobs.map(eachJob => (
            <li className="jobCard" key={eachJob.id}>
              <Link className="linkItem" to={`/jobs/${eachJob.id}`}>
                <div className="logoContainer">
                  <img
                    alt="company logo"
                    src={eachJob.companyLogoUrl}
                    className="companyLogo"
                  />
                  <div className="titleContainer">
                    <h1 className="jobTitle">{eachJob.title}</h1>
                    <div className="starContainer">
                      <FaStar className="starIcon" />
                      <p>{eachJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="jobDataContainer">
                  <div className="jobData">
                    <div className="locationContainer">
                      <MdLocationOn className="locationIcon" />
                      <p>{eachJob.location}</p>
                    </div>
                    <div className="jobTypeContainer">
                      <IoBagAddSharp className="locationIcon" />
                      <p>{eachJob.employmentType}</p>
                    </div>
                  </div>
                  <p className="salaryPackage">{eachJob.packagePerAnnum}</p>
                </div>
                <hr />
                <h1 className="description">Description</h1>
                <p>{eachJob.jobDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      )
    }
    if (jobs.length === 0) {
      return (
        <div className="nojobsContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="noJobsImage"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }
    return null
  }

  onFailureJobsView = () => {
    const failureImageUrl =
      'https://assets.ccbp.in/frontend/react-js/failure-img.png'

    return (
      <div className="onFailureJobView">
        <img
          src={failureImageUrl}
          alt="failure view"
          className="failureImage"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" className="retryBtn" onClick={this.onRetryJobs}>
          Retry
        </button>
      </div>
    )
  }

  onJobInProgreeView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobSearchContainer = () => {
    const {searchInput} = this.state
    return (
      <div className="searchContainer">
        <input
          onChange={this.onChangeSearch}
          type="search"
          placeholder="Search"
          className="searchEl"
          value={searchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="searchIconBtn"
          onClick={this.onClickSearch}
        >
          (<BsSearch className="search-icon" />)
        </button>
      </div>
    )
  }

  onRenderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiConstants.success:
        return this.onSuccessfulProfileView()
      case apiConstants.failure:
        return this.onFailureProfileView()
      case apiConstants.inProgress:
        return this.onProfilrInProgress()
      default:
        return null
    }
  }

  render() {
    const {employmentTypes, salaryRanges, jobsApiStatus} = this.state

    return (
      <div>
        <Header />
        <div className="bottomSection">
          <div className="searchOnTop">{this.jobSearchContainer()}</div>
          <div className="jobFilterContainer">
            {this.onRenderProfile()}

            <hr />
            <div>
              <h1 className="employement-type-head">Type of Employement</h1>
              <ul className="employementTypeContainer">
                {employmentTypes.map(eachEmployee => (
                  <li
                    key={eachEmployee.employmentTypeId}
                    className="employememntTypeItem"
                  >
                    <input
                      checked={eachEmployee.isClicked}
                      type="checkbox"
                      onChange={this.onChageEmployee}
                      value={eachEmployee.employmentTypeId}
                      id={eachEmployee.employmentTypeId}
                      name="employement"
                      className="checkbox"
                    />
                    <label htmlFor={eachEmployee.employmentTypeId}>
                      {eachEmployee.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h1 className="salary-rahed-head">Salary Range</h1>
              <ul className="employeeListContainer">
                {salaryRanges.map(eachSalary => (
                  <li
                    key={eachSalary.salaryRangeId}
                    className="salaryRangeItem"
                  >
                    <input
                      checked={eachSalary.isClicked}
                      type="checkbox"
                      value={eachSalary.salaryRangeId}
                      id={eachSalary.salaryRangeId}
                      name="salaryRange"
                      onChange={this.onChaneSalaryRange}
                      className="checkbox"
                    />
                    <label htmlFor={eachSalary.salaryRangeId}>
                      {eachSalary.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobsListContainer">
            <div className="search-in-jobSection">
              {this.jobSearchContainer()}
            </div>
            {jobsApiStatus === apiConstants.success && this.onSuccesJobsView()}
            {jobsApiStatus === apiConstants.failure && this.onFailureJobsView()}
            {jobsApiStatus === apiConstants.inProgress &&
              this.onJobInProgreeView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
