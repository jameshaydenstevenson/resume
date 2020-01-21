import React, { Component } from 'react'
import { db } from '../firebase/Firebase'
import ColType from '.././Types'
import { flattenDoc } from '../Util'
import '../styles/GlobalStyle.css'
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet"
import { Layout, BackTop, Row, Col, message } from 'antd'
var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup')
const Content = Layout.Content

const loadingMessage = (description) => {
  message.destroy()
  message.loading(description, 0)
}

const errorMessage = (description) => {
  message.destroy()
  message.error(description)
}

var stripe = null
var elements = null

const loadStripeScript = (callback) => {
  var existingScript = document.getElementById('stripe')
  if (existingScript) {
    existingScript.parentElement.removeChild(existingScript)
  }

  const script = document.createElement('script')
  script.src = 'https://js.stripe.com/v3'  // URL for the third-party library being loaded.
  script.id = 'stripe' // e.g., googleMaps or stripe
  document.body.appendChild(script)

  script.onload = () => {
    if (callback) callback()
  }
}

export default class Home extends Component {
  state = {
    user: null,
    person: null,
    accessLevel: null,
    loginMounted: false,
    height: 0, 
    width: 0,
    submitting: false,
  }
  

  stripeLoadedCallback = () => {
    console.log("stripe callback", window.hasOwnProperty('Stripe'))
    if (!window.hasOwnProperty('Stripe') || window.hasOwnProperty('Stripe') == null) {
      console.log("Could not load stripe.")
      return
    }

    stripe = window['Stripe']('pk_test_9m3KY6KRqCVoL5e5pzkoDbJk')
    elements = stripe.elements()

    // Custom styling can be passed to options when creating an Element.
    var style = {
      base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: "#32325d",
      }
    }

    // Create an instance of the card Element.
    var card = elements.create('card', {style: style})

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element')

    card.addEventListener('change', ((event) => {
      var displayError = document.getElementById('card-errors')
      if (event.error) {
        displayError.textContent = event.error.message
      } else {
        displayError.textContent = ''
      }
    }))

    var form = document.getElementById('payment-form')
    form.addEventListener('submit', ((event) => {
      event.preventDefault()

      var firstNameEl = document.getElementById("firstName")
      var emailEl = document.getElementById("email")
      var phoneEl = document.getElementById("phone")
      
      if (!firstNameEl || !emailEl || !phoneEl) {
        console.log("some form elements were null! in submit. returning early.")
        return
      }

      var firstName = firstNameEl.value
      var email = emailEl.value
      var phone = phoneEl.value
      var amount = 5000

      console.log("form values", firstName, email, phone, amount)

      this.setState({
        submitting: true,
      })
      loadingMessage("Processing. Please wait...")

      stripe.createToken(card).then((result) => {
        if (result.error) {
          // Inform the customer that there was an error.
          var errorElement = document.getElementById('card-errors')
          errorElement.textContent = result.error.message
        } else {
          // Send the token to your server.
          // stripeTokenHandler(result.token)
          console.log("Send token", result.token)
          
          // Will write back to the added doc on status update from server
          db.collection(ColType.paymentStatus)
            .add({
              status: 'Pending',
            })
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id)
              var statusListener = db.collection(ColType.paymentStatus)
                .doc(docRef.id)
                .onSnapshot((doc) => {
                  var statusInfo = flattenDoc(doc)
                  console.log("Received status update", statusInfo)
                  if (statusInfo.status === "Success") {
                    // unsub listener
                    statusListener()
                    this.setState({
                      submitting: false,
                    })
                    message.destroy()
                    this.props.history.push(
                      {
                        pathname: '/pay-success/'
                      }
                    )
                  }
                  else if (statusInfo.status === "Error") {
                    // unsub listener
                    statusListener()
                    this.setState({
                      submitting: false,
                    })
                    message.destroy()
                    this.props.history.push(
                      {
                        pathname: '/pay-error/'
                      }
                    )
                  }
                })
              
              // add paymentInfo
              db.collection(ColType.paymentInfo)
                .add({
                  paymentStatusRefId: docRef.id,
                  firstName: firstName,
                  email: email,
                  phone: phone,
                  amount: amount,
                  stripeToken: result.token
                })
                .then((docRef) => {

                })
                .catch((e) => {
                  console.log("paymentinfo e", e)
                  errorMessage("An error occurred. Please try again.")
                  this.setState({
                    submitting: false,
                  })
                })
          })
          .catch((error) => {
              console.error("payment status e", error)
              errorMessage("An error occurred. Please try again.")
              this.setState({
                submitting: false,
              })
          })
        }
      })
    }))
  }
  
  componentDidMount() {
    window.scrollTo(0, 0)
    loadStripeScript(this.stripeLoadedCallback)
    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  };

  scrollToPreviewVideo() {
    var previewContainerEl = document.getElementById('preview-video-container')
    var y = previewContainerEl.getBoundingClientRect().top + window.scrollY
    y -= 60
    window.scroll({
      top: y,
      behavior: 'smooth'
    })
  }

  render() {
    return (
     
      <div className="backround-paw-yellow">

        <Helmet>
            <meta charSet="utf-8" />
            <link href="https://fonts.googleapis.com/css?family=Caveat" 
              rel="stylesheet" />
            <title>Paw Call</title>
            <meta name="description" 
                  content={"Smart Learning Systems helps educators generate student " +
                  "centered learning plans, schedule instruction, " + 
                  "monitor progress on standards based goals, " +
                  "and allocate resources wisely."} 
            />
            <meta name="keywords" content={"dot it,dotit,dotitapp," +
                    "dotit special education,Special Education,IEP Goals,IEPS,IEP," +
                    "dotit IEPs,standards,standard,standard based,standard based IEP," +
                    "standard based IEP goals,software,iep software,iep goal software," +
                    "iep calendar,progress monitoring,iep progress monitoring,iep charts," +
                    "iep reports,print iep reports,printable iep reports,district reports," +
                    "district summary,school reports,school summary"} 
            />
            <meta name="google-site-verification" 
                  content="iEaOYr2I6plF2RMp4sZmlPCAnm249qe16BaIaAEQI_k" />

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lobster"/>



<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
<meta name="msapplication-TileColor" content="#da532c"/>
<meta name="theme-color" content="#ffffff"/>

        </Helmet>
      <BackTop visibilityHeight={1500}/>
      {/*<SupportDesk />*/}
      
     
      <CSSTransitionGroup
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnter={false}
          transitionLeave={false}>
     <div className="overflow-hidden">
     <Layout className="content background-paw-yellow pb-100">
            <Layout>
              <Content className="background-paw-yellow">
              
                <div className="pt-4">
                  <div className="max-w-1200 m-lr-auto">

                  <div className="absolute-tl w-100 pl-4 pt-4">
                  <Link to={'/'}>
    <img alt="img" src="/pawcall_icon.png" height={80} />
    <span className="font-paw-dark-blue pt-4 pl-2 w3-lobster font-40">Paw Call</span>
    </Link>
    </div>






<div className="pt-150">
                    <Row>
                    <Col 
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 12, offset: 0 }} 
                  className="pl-0 mb-0"
                >
                 <div className="w-100 text-center">
                <img src="/pawcall_icon.png" alt="img" 
                style={{ width:"70%"}} />
                
                </div>
                </Col>
                <Col 
                  xs={{ span: 24, offset: 0 }} 
                  sm={{ span: 24, offset: 0 }} 
                  md={{ span: 24, offset: 0 }} 
                  lg={{ span: 24, offset: 0 }} 
                  xl={{ span: 12, offset: 0 }} 
                >
                  <div className="ml-2 mt-1">
                  <div className="font-paw-dark-blue w3-lobster font-30 mr-100"> 
                    Just fill out this form and Dr. Scott will give you a call in the 
                    next few minutes.
                  </div>
              <form id="payment-form" className="pt-4">
                <div className="pb-2">
                  <Row gutter={16}>
                    <Col span={8}>
                  <label htmlFor="firstName" className="font-paw-dark-blue">
                    First name
                  </label>
                  </Col>
                  <Col span={8}>
                  <input id="firstName" required={true}/>
                  </Col>
                  </Row>
                </div>

                <div className="pb-2">
                  <Row gutter={16}>
                    <Col span={8}>
                  <label htmlFor="email" className="font-paw-dark-blue">
                  Email address
                  </label>
                  </Col>
                  <Col span={8}>
                  <input id="email" required={true}/>
                  </Col>
                  </Row>
                </div>

                <div className="pb-2">
                  <Row gutter={16}>
                    <Col span={8}>
                  <label htmlFor="phone" className="font-paw-dark-blue">
                    Phone number to call
                  </label>
                  </Col>
                  <Col span={8}>
                  <input id="phone" required={true}/>
                  </Col>
                  </Row>
                </div>

                <div className="pb-2 mr-100">
                  <Row gutter={16}>
                    <Col span={24}>
                  <div className="form-row ">
                <label htmlFor="card-element" className="font-paw-dark-blue">
                  Credit or debit card
                </label>
                <div id="card-element" className="background-fff p-1">
                </div>

                <div id="card-errors" role="alert"></div>
              </div>
              
                  </Col>
                  <Col span={0}>
                  
                  </Col>
                  </Row>
                </div>



              
            <div >
            <button 
              className="ant-btn ant-btn-lg paw-btn-2"
              disabled={this.state.submitting}
            >
              {this.state.submitting ? 'Submitting payment...' : 'Submit Paw Call Payment'}
            </button>

              </div>
            </form>
            </div>
            </Col>
            </Row>

            </div>




            <div className="pb-100 pt-200 background-paw-yellow ">
    

        <div className="w-100 text-center ">
    <div className="font-paw-orange font-30 w3-lobster">Paw Call</div>
         </div>

         <div className="mt-1 text-center font-paw-dark-blue">
        Product of Scott C. Stevenson, D.V.M.
        </div>


         </div>




            </div>
            </div>


          </Content>
          </Layout>
          </Layout>
      </div>
      </CSSTransitionGroup>
      </div>
     
    )
  }
}