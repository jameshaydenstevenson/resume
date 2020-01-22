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
     
      <div className="">

        <Helmet>
            <meta charSet="utf-8" />
            <link href="https://fonts.googleapis.com/css?family=Caveat" 
              rel="stylesheet" />
            <title>Paw Call</title>
            <meta name="description" 
  content={"Dr. Scott Stevenson Veterinary Services in your home or on the phone. "+
"Call 828.699.8299 to schedule today!"} 
            />
            <meta name="keywords" content={"pawcall, paw call, pawcall.chat,"+
            "scott stevenson, scott stevenson vet, scott stevenson hendersonville"+
            "stevenson veternarian, stevenson vet, stevenson vet hendersonville nc"+
            "veterinarians hendersonville, veterinarians hendersonville nc"+
            "vet house call, vet house calls, vet at home care, pet at home care"+
            "scott stevenson house call, scott stevenson paw call, paw call vet"+
            "paw call vet services, paw call veterinarian, vet phone consultation"+
            "vet hendersonville, vet consultation, pet consultation hendersonville nc"+
            "vet transylvania, vet polk county, pet consultation transylvania nc"+ 
            "vet henderson county nc, vet asheville nc, pet consultation buncombe nc"+ 
            "vet polk county sc, vet asheville nc, pet consultation buncombe nc"} 
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
<meta name="theme-color" content="#f7f7f7"/>
        </Helmet>
      <BackTop visibilityHeight={1500}/>
      
      <CSSTransitionGroup
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnter={false}
          transitionLeave={false}>
     <div className="overflow-hidden ">
      <Layout className="content ">
            <Layout>
              <Content className="">
          <div className={""}>

    <div className="absolute-tl w-100 pt-4 "
    style={{marginLeft:'1%'}}>
    <img alt="img" src="/pawcall_icon.png" height={120} />
    <span className="font-paw-dark-blue mt-4 w3-lobster font-50"
    style={{marginLeft:'1%'}}
    >Paw Call</span>
    </div>
   

    <div id="catphone" className="">
    <Row gutter={32}>
    <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 3, offset: 0 }} 
                    className="text-center ">
                

                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 11, offset: 0 }} 
                    className="text-center mt-50">
                      
            <div  className=" w3-lobster font-50 mt-100">
            Dr. Scott Stsdsdssevenson <br/>Veterinary Services<br/>
            In your home or on the phone<br/>
        </div>

                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 10, offset: 0 }} 
                    className="text-center">
                    

                  </Col>
                  </Row>
        
    </div>






    <div id="portfolio" className="background-paw-dark-blue">
    <div className="background-paw-dark-blue pt-100 ">
                <Row gutter={32}>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 8, offset: 0 }} 
                    className="text-center">
                      
                      <img alt="img" src="/scott.jpg" height={300} />

                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 16, offset: 0 }} className="" >
                 <div className="pawcall-font-title mb-2">about.</div>
    <div className="text-left font-20 pawcall-font-yellow word-wrap white-space-normal">
<div> I am Scott Stevenson, a practicing veterinarian residing in
  Henderson County, North Carolina. I have been in private practice for 34 years
  and have a special interest in preventative medicine and general health care 
  for your dogs and cats. I am a great believer in the human-pet bond and feel that
  home health is the best way to take care of your pet family. 
</div>
             </div>
                  </Col>
                  </Row>
             </div>


             <div className="pawcall-font-title mt-100 text-center mb-4">paw call perks.</div>  

    <div className="background-paw-dark-blue ">
                <Row gutter={32}>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 8, offset: 0 }} className = "text-center mt-2 mb-2">
                      <img alt="img" src="/pc-clarity.png" height={80} />
            <div className="pt-2 font-24 pawcall-font-orange">
            clarity </div>
            <div className="p-1 text-left font-16 pawcall-font-yellow ">
            Paw Call provides you a better understanding of your pet's health,
            of the procedures that your vet may recommend,
            and of the medical terminology used online and by your veternarian.
             </div>
                        

                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 8, offset: 0 }} className = "text-center mt-2 mb-2">
                      <img alt="img" src="/pc-interaction.png" height={80} />
                       
                       <div className="pt-2 font-24 pawcall-font-orange">
            direct interaction </div>
            <div className="p-1 text-left font-16 pawcall-font-yellow">
            Paw Call offers you the ability to talk directly with a licensed,
            experienced veterinarian that can provide you with simple, detailed explanations
            that you cannot find online.
            </div>
                        
                  </Col>
                  <Col s
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 8, offset: 0 }} className = "text-center mt-2 mb-2">
                      <img alt="img" src="/pc-cheap.png" height={80} />
                       <div className="pt-2 font-24 pawcall-font-orange">
                       inexpensive </div>
            <div className="p-1 text-left font-16 pawcall-font-yellow">
            Paw Call provides you the opportunity to assess your pet's
            treatment options right in your home before paying for office visits.</div>
                  </Col>
                 
                  </Row>
              </div>

                 <div className="pawcall-font-title mt-4">paw calls: phone consultations.*</div>  
      <div className="pawcall-font pawcall-font-yellow pt-1 pb-2">
        Hours of Operation: Monday-Friday 8-5pm
      </div>
      <div className="pawcall-font pb-2">
        Please select a Paw Call service:
      </div>
      <div>
                    
              <div className="background-paw-dark-blue">
                <Row gutter={32}>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                      <Link to="/pay" 
        className="ant-btn ant-btn-lg paw-btn p-0 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '210px'}}
                      >
                        <div className="p-2 font-20 word-wrap white-space-normal">
                          <b>5 minute consultation</b><br/> over the phone</div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$10</div>
                          </div>
                        </div>

                      </Link>
                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                      <Link to="/pay" 
  className="ant-btn ant-btn-lg paw-btn p-0 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '210px'}}
                      >
                        <div className="p-2 font-20 word-wrap white-space-normal">
                        <b>10 minute consultation</b><br/>  over the phone</div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$19</div>
                          </div>
                        </div>
                      </Link>
                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                      <Link to="/pay" 
className="ant-btn ant-btn-lg paw-btn p-0 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '210px'}}
                      >
                        <div className="p-2 font-20 word-wrap white-space-normal">
                        <b>15 minute consultation</b><br/>  over the phone</div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$28</div>
                          </div>
                        </div>
                      </Link>
                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                      <Link to="/pay" 
className="ant-btn ant-btn-lg paw-btn p-0 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '210px'}}
                      >
                        <div className="p-2 font-20 word-wrap white-space-normal">
                        <b>30 minute consultation</b><br/>  over the phone</div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$50</div>
                          </div>
                        </div>
                      </Link>
                  </Col>
                  </Row>
              </div>
             

            
              <div className="pawcall-font-title mt-100 text-center mb-4">home visit perks.</div>  

    <div className="background-paw-dark-blue ">
                <Row gutter={32}>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 8, offset: 0 }} className = "text-center mt-2 mb-2">
                      <img alt="img" src="/pawcall_snap.png" height={80} />
            <div className="pt-2 font-24 pawcall-font-orange">
            convenience </div>
            <div className="p-1 text-left font-16 pawcall-font-yellow">
            Paw Call Home Visits are a great solution to care for your pets with ease.
            Dr. Stevenson will come right to your door to provide
            your pets with the treatment they need.
             </div>
                        

                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 8, offset: 0 }} className = "text-center mt-2 mb-2">
                      <img alt="img" src="/pawcall_insight.png" height={80} />
                       
                       <div className="pt-2 font-24 pawcall-font-orange">
            insight </div>
            <div className="p-1 text-left font-16 pawcall-font-yellow">
            Paw Call Home Visits allow Dr. Stevenson to observe your pets
            in their home environment, so he can offer
             you more helpful, tailored suggestions 
            about your pet's home care routine.
            </div>
                        
                  </Col>
                  <Col s
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 8, offset: 0 }} className = "text-center mt-2 mb-2">
                      <img alt="img" src="/pawcall_time.png" height={80} />
                       <div className="pt-2 font-24 pawcall-font-orange">
                       time </div>
            <div className="p-1 text-left font-16 pawcall-font-yellow">
            Paw Call Home Visits save you time and energy so 
            you don't have to get your pets in and out of the car,
            sit in traffic, and wait at the veterinary office. 
            </div>
                  </Col>
                 
                  </Row>
              </div>
<div className="pawcall-font-title mt-4">
  home visits: in home pet care with Dr. Stevenson.</div>   
                 <div className="pawcall-font pt-1 pb-2">
        In addition to physical exams and vaccinations,
        Dr. Stevenson can treat a variety of routine illnesses, such as: 
        allergies, eye and ear issues,
        skin problems, gastrointestinal issues, and a wide array of chronic
        conditions (i.e. arthritis, diabetes, kidney disease, 
        thyroid disease, seizure disorders, and more).
      </div>
      
                 <div className="pawcall-font pawcall-font-yellow pb-2">
        Hours of Operation: Monday-Friday 8-5pm
      </div>
      <div className="pawcall-font pb-2 ">
        Please call 828.699.8299 to schedule an appointment for the following Paw Call services:
      </div>
              <div className="background-paw-dark-blue">
                <Row gutter={32}>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                      <div
        className="paw-btn-stagnant text-center p-1 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '290px'}}
                      >
                        <div className="pt-2 font-20 word-wrap white-space-normal">
                          <b>Home Visit with Physical Exam</b> </div>
                          <div className=" font-16 word-wrap white-space-normal">
                          Henderson County </div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$75</div>
                          </div>
                        </div>

                      </div>
                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                       <div
        className="paw-btn-stagnant text-center p-1 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '290px'}}
                      >
                        <div className="pt-2 font-20 word-wrap white-space-normal">
                          <b>Home Visit<br/> Paw Pack</b>
                          </div>
                          <div className="font-16 word-wrap white-space-normal">
                          Henderson County:<br/>  
                          includes physical exam
                          and tailored vaccinations</div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$115</div>
                          </div>
                        </div>
                      </div>
                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                         <div
        className="paw-btn-stagnant text-center p-1 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '290px'}}
                      >
                        <div className="pt-2 font-20 word-wrap white-space-normal">
                        <b>Home Visit with Physical Exam</b><br/> 
                        </div>
                        <div className="font-16 word-wrap white-space-normal">
                        Buncombe, Polk, or Transylvania County </div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$100</div>
                          </div>
                        </div>
                      </div>
                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 6, offset: 0 }} >
                        <div
        className="paw-btn-stagnant text-center p-1 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '290px'}}
                      >
                        <div className="pt-2 font-20 word-wrap white-space-normal">
                        <b>Home Visit<br/> Paw Pack</b>
                          
                          </div>
                          <div className="font-16 word-wrap white-space-normal">
                        Buncombe, Polk, or Transylvania County:<br/>  
                          includes physical exam
                          and tailored vaccinations
                          
                          </div>
                        <div className="absolute-bl w-100">
                          <div className="p-2 border-top">
                            <div className="font-24">$140</div>
                          </div>
                        </div>
                      </div>
                  </Col>
                  </Row>
                  <Row gutter={32} className="mt-2 mb-100">
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 24, offset: 0 }} >
                         <div
        className="paw-btn-stagnant text-center p-1 inline-block w-100 h-100 relative mb-2"
                      style={{minHeight: '290px'}}
                      >
                        <div className="p-2 font-bold font-20 word-wrap white-space-normal">
                          Continued Services</div>
                          <div className="font-16 word-wrap white-space-normal">
                          Upon consultation, there may be an additional cost for these services:
                          </div>
                          <div className="font-16 word-wrap white-space-normal">
                          Toe Nail Trim ($15)</div>
                          <div className="font-16 word-wrap white-space-normal">
                          Fecal Exam ($15)</div>
                          <div className="font-16 word-wrap white-space-normal">
                          Heart worm test ($40)</div>
                          <div className="font-16 word-wrap white-space-normal">
                          Health Profile/Blood Screen ($85)</div>
                          <div className="font-16 word-wrap white-space-normal">
                          Medications (dependent upon your pet's needs)</div>
                          <div className="font-16 pb-2 word-wrap white-space-normal">
                          Additional Pet Exams ($45/pet)</div>

                      </div>
                  </Col>
                  </Row>
                  </div>
                  

                 </div> 
           
    </div>



    <div id="middle" className="">
    <Row gutter={32} align="">
    <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 1, offset: 0 }} 
                    className="text-center">
                

                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 13, offset: 0 }} 
                    className="text-center ">
                      
<div  className=" w3-lobster pawcall-font-title-purple  font-60 mt-50">
            Give Dr. Scott Stevenson <br/> a call today at<br/> 828.699.8299
        </div>
        

                  </Col>
                  <Col 
                    xs={{ span: 24, offset: 0 }} 
                    sm={{ span: 24, offset: 0 }} 
                    md={{ span: 24, offset: 0 }} 
                    lg={{ span: 24, offset: 0 }} 
                    xl={{ span: 10, offset: 0 }} 
                    className="text-center">
                    

                  </Col>
                  </Row>
        
    </div>


    <div className="pb-100 pt-100 background-paw-dark-blue ">
    <div className="w-100 text-center  ">
    <div className="text-center">
        <img alt="img" src="/pawcall_icon_teal.png" height={250} /></div>
    <div className="pawcall-font-orange pt-2 font-30 w3-lobster">Paw Call</div>
         </div>

         <div className=" mt-1 text-center font-paw-yellow">
        Product of Scott C. Stevenson, D.V.M.
        </div>

        
       
  <div className="background-paw-dark-blue pl-2 pr-2 mt-50 font-12 text-center font-white">
       
*This service is for consultation only. A diagnosis or treatment cannot be given 
without a proper veternarian-client relationship. 


        </div>
        <div className="background-paw-dark-blue pl-2 pr-2 text-center font-12 font-white">
       This only can be established if
the pet is physically seen. This service is not a substitute for having an office 
visit by your veternarian.


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