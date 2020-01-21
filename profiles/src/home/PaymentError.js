import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import '../styles/GlobalStyle.css'
import { Helmet } from "react-helmet"
import { Layout, BackTop, Row, Col } from 'antd'
var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup')
const Content = Layout.Content



export default class Home extends Component {
  state = {
    user: null,
    person: null,
    accessLevel: null,
    loginMounted: false,
    height: 0, 
    width: 0,
  }

  componentDidMount() {
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
     
      <div className="backround-layout-grey">

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
     <Layout className="content background-fff">
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
<div className="mt-50">
<div className="font-paw-dark-blue w3-lobster font-30 mr-100"> 
                    There appears to be some type of error in your transaction.
                    Please try entering in your information again.
                  </div>
                  <Link to="/pay">
                    <div className="mt-4 ">
                    <button className="ant-btn ant-btn-lg paw-btn-2">
                      Go Back To Payment Page
                      </button>
                    </div>
                    </Link>
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