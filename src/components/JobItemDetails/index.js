import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {IoBagAddSharp} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import './index.css'

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    similarJobs: [],
    jobDetails: {},
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.onRenderJobItem()
  }

  onRenderJobItem = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      this.setState({apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
    const data = await response.json()
    const jobDetails = data.job_details

    const jobDetailsCamelCase = {
      companyLogoUrl: data.job_details?.company_logo_url || '',
      companyWebsiteUrl: data.job_details?.company_website_url || '',
      employmentType: jobDetails?.employment_type || '',
      id: jobDetails?.id || '',
      jobDescription: jobDetails?.job_description || '',
      skills: jobDetails?.skills || '',
      lifeAtCompany: jobDetails?.life_at_company || '',
      location: jobDetails?.location || '',
      packagePerAnnum: jobDetails?.package_per_annum || '',
      rating: jobDetails?.rating || '',
      title: jobDetails?.title || '',
    }
    const similarJobCamelCase = data.similar_jobs

    const similarJobsCamelCase = similarJobCamelCase?.map(eachJob => ({
      similarJovLogoUrl: eachJob.company_logo_url || '',
      employmentType: eachJob.employment_type || '',
      id: eachJob.id || '',
      jobDescription: eachJob.job_description || '',
      location: eachJob.location || '',
      rating: eachJob.rating || '',
      title: eachJob.title || '',
    }))
    this.setState({
      jobDetails: jobDetailsCamelCase,
      similarJobs: similarJobsCamelCase,
    })
  }

  onClickRetry = () => {
    this.onRenderJobItem()
  }

  onSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    const jobDetailsLength = Object.keys(jobDetails).length
    const similarJobLength = similarJobs.length
    if (jobDetailsLength > 0 && similarJobLength > 0) {
      return (
        <div>
          <Header />
          <div className="bg-container">
            <div className="jotDetailCard">
              <div className="jobDataCard">
                <div className="logoContainer">
                  <img
                    alt="job details company logo"
                    src={companyLogoUrl}
                    className="companyLogo"
                  />
                  <div className="titleContainer">
                    <h1>{title}</h1>
                    <div className="starContainer">
                      <FaStar className="starIcon" />
                      <p>{rating}</p>
                    </div>
                  </div>
                </div>
                <div className="jobDataContainer">
                  <div className="jobData">
                    <div className="locationContainer">
                      <MdLocationOn className="locationIcon" />
                      <p>{location}</p>
                    </div>
                    <div className="jobTypeContainer">
                      <IoBagAddSharp className="locationIcon" />
                      <p>{employmentType}</p>
                    </div>
                  </div>
                  <p className="salaryPackage">{packagePerAnnum}</p>
                </div>
                <hr />
                <div className="descriptionContainer">
                  <h1 className="jobDescription">Description</h1>
                  <a href={companyWebsiteUrl} className="companyWebsite">
                    Visit{' '}
                    <span className="linkIcon">
                      <FiExternalLink />
                    </span>
                  </a>
                </div>
                <p>{jobDescription}</p>

                <h1 className="skillsHeading">Skills</h1>

                {skills && (
                  <ul className="skillsList">
                    {skills.map(eachSkill => (
                      <li className="skillListItem" key={eachSkill.name}>
                        <img
                          src={eachSkill.image_url}
                          alt={eachSkill.name}
                          className="skillImage"
                        />
                        <h1 className="skillName">{eachSkill.name}</h1>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <h1 className="lifeAtCompanyHead">Life at Company</h1>
              <div className="lifeAtCompany">
                <p className="lifeAtCompanyDescription">
                  {lifeAtCompany.description}
                </p>
                <img
                  src={lifeAtCompany.image_url}
                  alt="life at company"
                  className="lifeAtImage"
                />
              </div>
            </div>
            <h1 className="similarJobHead">SimilarJob</h1>
            <ul className="similarJobList">
              {similarJobs.map(eachSimilarJob => (
                <li className="similarJobContainer" key={eachSimilarJob.id}>
                  <div className="logoContainer">
                    <img
                      alt="similar job company logo"
                      src={eachSimilarJob.similarJovLogoUrl}
                      className="companyLogo"
                    />
                    <div className="titleContainer">
                      <h1>{eachSimilarJob.title}</h1>
                      <div className="starContainer">
                        <FaStar className="starIcon" />
                        <p>{eachSimilarJob.rating}</p>
                      </div>
                    </div>
                  </div>
                  <h1 className="descriptionJob">Description</h1>
                  <p>{eachSimilarJob.jobDescription}</p>
                  <div className="similarjobData">
                    <div className="locationContainer">
                      <MdLocationOn className="similarlocationIcon" />
                      <p>{eachSimilarJob.location}</p>
                    </div>
                    <div className="jobTypeContainer">
                      <IoBagAddSharp className="similarlocationIcon" />
                      <p>{eachSimilarJob.employmentType}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
    return null
  }

  onFailureview = () => (
    <div>
      <Header />
      <div className="failureContainer">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Ooops! Something went wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button className="retryBtn" onClick={this.onClickRetry} type="button">
          Retry
        </button>
      </div>
    </div>
  )

  onProgressView = () => (
    <div>
      <Header />
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.onSuccessView()
      case apiConstants.failure:
        return this.onFailureview()
      case apiConstants.inProgress:
        return this.onProgressView()
      default:
        return null
    }
  }
}

export default JobItemDetails
